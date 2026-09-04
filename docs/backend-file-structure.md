---
title: FarmIT backend file structure
created: 2026-08-25
author: AI-assisted
last_updated: 2026-08-25
updated_by: AI-assisted
status: active
---

# FarmIT backend file structure

Canonical Spring Boot layout for `farmitai-backend`. Root package is `com.farmitai.farmitai_backend`.

This document overrides section 32 of the system specification. Do not introduce a second tree.

---

## Layout rules

- One domain package per feature. Nested `model` / `repository` / `service` / `controller` / `dto` only when a feature has more than a handful of types.
- Shared HTTP shapes live in `common.dto`. Shared wiring lives in `common.config`. External systems live in `infrastructure`.
- Phase 1 builds only `auth`, `user`, `waitinglist`, `admin` (waiting-list APIs), and a WhatsApp **verification stub**. Other domain packages are listed so later work lands in the right place — do not create their tables or endpoints until Phase 1 APIs exist. See [api-contract.md](./api-contract.md).

---

## Package tree

```text
src/main/java/com/farmitai/farmitai_backend/

├── FarmitaiBackendApplication.java

├── common/
│   ├── config/          CORS, OpenAPI/Swagger, Async, Scheduling
│   ├── exception/       GlobalExceptionHandler, domain exceptions
│   ├── util/
│   └── dto/             ApiResponse, PaginatedResponse, ErrorResponse

├── infrastructure/
│   ├── security/        JWT filter, SecurityConfig, UserDetailsService
│   ├── client/          FastAPI, Weather, WhatsApp Cloud API (later)
│   ├── persistence/     JPA auditing, Flyway
│   └── storage/         S3-compatible upload (later)

└── domain/

    ├── auth/            PHASE 1 — OTP request/verify, refresh, logout
    │   ├── AuthController.java
    │   ├── AuthService.java
    │   ├── TokenRefreshService.java
    │   └── dto/
    │
    ├── user/            PHASE 1 — User, Role, UserRole
    │   ├── User.java
    │   ├── Role.java
    │   ├── UserRole.java
    │   ├── UserRepository.java
    │   ├── UserService.java
    │   ├── UserAdminController.java
    │   └── dto/
    │
    ├── waitinglist/     PHASE 1 — join + status for the authenticated user
    │   ├── WaitingList.java
    │   ├── WaitingListRepository.java
    │   ├── WaitingListService.java
    │   └── WaitingListController.java
    │
    ├── admin/           PHASE 1 — waiting-list review only
    │   ├── AdminWaitingListController.java
    │   └── AdminWaitingListService.java
    │
    ├── whatsapp/        PHASE 1 STUB — Meta hub.verify only; no conversations
    │   └── WhatsAppWebhookController.java
    │
    ├── farmer/          later
    ├── crop/            later
    ├── planting/        later
    ├── activity/        later
    ├── diagnosis/       later
    ├── agrobusiness/    later
    ├── input/           later — catalogue; diagnosis_products lives here or in diagnosis
    ├── match/           later — nearest supplier; Haversine in SQL first, PostGIS later
    ├── daily/           later — FarmIT Daily; recommendations fold in here until they earn a package
    ├── weather/         later
    ├── notification/    later
    ├── gamification/    later
    ├── learning/        later
    └── audit/           later
```

---

## Phase 1 files that must exist

| Area | Responsibility |
| :--- | :--- |
| `common.dto` | Success and error envelopes from [api-contract.md](./api-contract.md) |
| `common.exception` | Map domain errors to those envelopes |
| `common.config` | OpenAPI, CORS, security-related beans |
| `infrastructure.security` | JWT access + refresh, role checks |
| `domain.auth` | Phone OTP and tokens |
| `domain.user` | Users and roles |
| `domain.waitinglist` | Farmer join / `GET me` |
| `domain.admin` | List, approve, reject, bulk-approve |
| `domain.whatsapp` | `GET` webhook verification; `POST` returns 200 and does nothing else |

---

## Explicit non-goals for this tree

- No `recommendations` package until Daily needs one. Diagnosis treatment text can live on the diagnosis response.
- No `intelligence` package. Heat maps stay admin aggregates in Phase 10.
- No PostGIS in Phase 1. Matching, when it ships, starts with stored lat/lng and SQL distance.
- WhatsApp conversation, message, and account tables wait until the bot has product flows.
