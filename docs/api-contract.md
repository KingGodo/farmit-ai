---
title: FarmIT API contract (first ship)
created: 2026-08-25
author: AI-assisted
last_updated: 2026-09-04
updated_by: AI-assisted
status: active
---

# FarmIT API contract

First-ship HTTP contract for `farmitai-backend`. Base path `/api/v1`. JSON only. OpenAPI is generated from the same types.

Do not add farm, diagnosis, or Daily endpoints until these exist and are stable.

---

## Envelope

Every response uses one of these shapes. Do not return a bare DTO or a Spring default error page.

### Success

```json
{
  "success": true,
  "data": {}
}
```

`data` may be an object, an array, or null for empty 204-style deletes (still return 200 with `data: null` in first ship).

### Paginated success

```json
{
  "success": true,
  "data": {
    "items": [],
    "page": 0,
    "size": 20,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Pages are zero-based.

### Error

```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "That code has expired. Request a new one.",
    "details": []
  }
}
```

`details` is an array of `{ "field": "phone", "message": "must be E.164" }` for validation. It is `[]` otherwise.

| HTTP | When |
| :--- | :--- |
| 400 | Validation, malformed JSON |
| 401 | Missing/invalid/expired access token; bad OTP after user exists |
| 403 | Authenticated but role or user status forbids the route |
| 404 | Admin requested a waiting-list id that does not exist |
| 409 | Waiting list already joined; phone already bound to another flow as documented |
| 429 | OTP request or verify rate limit |
| 500 | Unexpected |

### Error codes

| code | HTTP | Meaning |
| :--- | :--- | :--- |
| VALIDATION_ERROR | 400 | Bean validation failed |
| UNAUTHENTICATED | 401 | No usable access token |
| INVALID_OTP | 401 | Code wrong or already consumed |
| OTP_EXPIRED | 401 | Challenge past `expires_at` |
| FORBIDDEN | 403 | Wrong role, or `PENDING` user hitting a later-phase route |
| NOT_FOUND | 404 | Unknown waiting-list id |
| WAITING_LIST_ALREADY_JOINED | 409 | This user already has a row |
| RATE_LIMITED | 429 | OTP throttle |
| INTERNAL_ERROR | 500 | Unhandled |

---

## Auth

Farmer default is **phone + OTP**. Admin login is **email + password**. WhatsApp does not issue tokens in first ship.

Phone numbers are E.164. Zimbabwe example: `+263771234567`.

Access JWT: 15 minutes, `Authorization: Bearer`. Claims: `sub` (user id), `roles`, `status`. Refresh: 30 days, rotated on use, stored hashed.

A `PENDING` farmer or agronomist may call `/auth/me`, `/auth/refresh`, `/auth/logout`, and `/waiting-list*`. Everything else is 403 `FORBIDDEN`.

### POST `/auth/otp/request`

Public. Creates or replaces the open challenge for that phone. Does not create a user yet.

```json
{ "phone": "+263771234567" }
```

```json
{
  "success": true,
  "data": {
    "phone": "+263771234567",
    "expiresInSeconds": 300
  }
}
```

Never return the code in production. Hash it at rest. Rate limit: 1 request per phone per 60 seconds, 5 per hour → 429 `RATE_LIMITED`.

Until an SMS provider is wired, local/dev sets `FARMIT_OTP_LOG_CODE=true` (the default). Then `data.devCode` is the 6-digit code. Production must set `FARMIT_OTP_LOG_CODE=false` so `devCode` is omitted. The marketing waitlist does not use OTP.

### POST `/auth/otp/verify`

Public.

```json
{ "phone": "+263771234567", "code": "482193", "applicantType": "FARMER" }
```

`applicantType` is `FARMER` or `AGRONOMIST`. Omit it and it defaults to `FARMER`.

On success: consume the challenge; create the user if new (`status=PENDING`, role from `applicantType`); issue tokens. If the phone already exists and has not joined the waiting list yet, the waitlist role is updated to match.

```json
{
  "success": true,
  "data": {
    "accessToken": "…",
    "refreshToken": "…",
    "expiresInSeconds": 900,
    "user": {
      "id": "3f1e8c2a-…",
      "phone": "+263771234567",
      "email": null,
      "status": "PENDING",
      "roles": ["FARMER"]
    }
  }
}
```

Wrong code increments `attempt_count`. Five failures consume the challenge → `INVALID_OTP`. Expired → `OTP_EXPIRED`.

### POST `/auth/login`

Admin (and later agro) email/password. Farmers should not need this.

```json
{ "email": "admin@farmit.co.zw", "password": "…" }
```

Same token payload as OTP verify. 401 `UNAUTHENTICATED` on bad credentials (do not say which field).

### POST `/auth/refresh`

Public (holds a refresh token, not an access token).

```json
{ "refreshToken": "…" }
```

Returns a new access + refresh pair. Old refresh is revoked. Reuse of a revoked token revokes the family and returns 401.

### POST `/auth/logout`

Authenticated. Revokes the presented refresh token.

```json
{ "refreshToken": "…" }
```

```json
{ "success": true, "data": null }
```

### GET `/auth/me`

Authenticated.

```json
{
  "success": true,
  "data": {
    "id": "3f1e8c2a-…",
    "phone": "+263771234567",
    "email": null,
    "status": "PENDING",
    "roles": ["FARMER"],
    "waitingList": {
      "status": "PENDING",
      "createdAt": "2026-08-25T18:01:00Z"
    }
  }
}
```

`waitingList` is `null` if the farmer has not joined yet.

---

## Waiting list (farmer / agronomist)

Until SMS exists, the marketing site joins through the public open endpoint. Phone OTP remains for later farmer login.

### POST `/waiting-list/open`

Public. Creates the user if the phone is new (`status=PENDING`, role from `applicantType`), then the waiting-list row. Second join for the same phone is 409 `WAITING_LIST_ALREADY_JOINED`. Admin phones are 403 `FORBIDDEN`.

```json
{
  "phone": "+263771234567",
  "name": "Tendai Moyo",
  "location": "Murewa",
  "farmingType": "Smallholder · Maize",
  "email": "tendai@example.com",
  "applicantType": "FARMER"
}
```

Agronomists send `applicantType: "AGRONOMIST"` and may omit `farmingType`.

```json
{
  "success": true,
  "data": {
    "id": "9c0a…",
    "status": "PENDING",
    "applicantType": "FARMER",
    "name": "Tendai Moyo",
    "phone": "+263771234567",
    "location": "Murewa",
    "farmingType": "Smallholder · Maize",
    "createdAt": "2026-08-25T18:01:00Z",
    "districtSignups": 14
  }
}
```

`districtSignups` is how many waiting-list rows share that `location`.

### POST `/waiting-list`

Role `FARMER` or `AGRONOMIST`. Copies `phone` from the user. Same body as `/waiting-list/open` without `phone`. Second call is 409 `WAITING_LIST_ALREADY_JOINED`. Same `data` shape as the open endpoint.

### GET `/waiting-list/me`

Role `FARMER` or `AGRONOMIST`. 404 `NOT_FOUND` if they have not joined.

Same `data` shape as POST.

---

## Waiting list (admin)

All routes require role `ADMIN` and `users.status = ACTIVE`.

### GET `/admin/waiting-list`

Query: `status` (`PENDING` \| `APPROVED` \| `REJECTED`, optional), `applicantType` (`FARMER` \| `AGRONOMIST`, optional), `page` (default 0), `size` (default 20, max 100), `q` (optional name/phone search).

Paginated envelope. Each item:

```json
{
  "id": "9c0a…",
  "userId": "3f1e…",
  "name": "Tendai Moyo",
  "phone": "+263771234567",
  "email": null,
  "location": "Murewa",
  "farmingType": "Maize",
  "applicantType": "FARMER",
  "status": "PENDING",
  "notes": null,
  "createdAt": "2026-08-25T18:01:00Z",
  "reviewedAt": null
}
```

### GET `/admin/waiting-list/{id}`

Single item. 404 if missing.

### PATCH `/admin/waiting-list/{id}`

```json
{
  "status": "APPROVED",
  "notes": "Murewa maize — include in first cohort"
}
```

`status` must be `APPROVED` or `REJECTED`. Approve also sets `users.status = ACTIVE`. Reject leaves the user `PENDING` (they can still read `/waiting-list/me`). Set `reviewed_by` / `reviewed_at`.

Returns the updated item.

### POST `/admin/waiting-list/bulk-approve`

```json
{ "ids": ["9c0a…", "1ab2…"] }
```

Empty `ids` means **all current `PENDING` rows**. Returns `{ "approvedCount": 42 }`.

---

## WhatsApp stub

No auth. No user creation. No message storage.

### GET `/whatsapp/webhook`

Meta verification. Query: `hub.mode`, `hub.verify_token`, `hub.challenge`.

If `hub.mode=subscribe` and `hub.verify_token` matches config, return **plain text** `hub.challenge` with 200. This is the only endpoint that does not use the JSON envelope.

Mismatch → 403.

### POST `/whatsapp/webhook`

Return `200` and `{ "success": true, "data": null }`. Do not parse, persist, or reply. Conversation depth is Phase 8.

Verify Meta `X-Hub-Signature-256` when the app secret is configured; if configured and invalid, 403.

---

## Out of contract until later

`/farmers`, `/farms`, `/diagnoses`, `/daily`, `/weather`, `/agro-businesses`, inbound WhatsApp flows, and dashboard pages that are not waiting-list admin. Phase 2 UI consumes only the admin routes above plus `/auth/login`.
