---
title: FarmIT first ship vs later
created: 2026-08-25
author: AI-assisted
last_updated: 2026-09-04
updated_by: AI-assisted
status: active
---

# FarmIT first ship vs later

Product vision stays in the [system specification](./FarmIT_1.0_System_Specification.md). This file is the cut: what we build before anything else, and what we do not.

---

## First ship (Phase 1)

Farmers and agronomists join a waiting list with their details (no SMS yet), then sit behind an admin queue. The API is live on a DigitalOcean Droplet with Flyway and OpenAPI.

| Item | Notes |
| :--- | :--- |
| Spring Boot on a droplet | Docker, Nginx, TLS, PostgreSQL. Module name `farmitai-backend`. |
| Flyway | `V1` = identity + waiting list only. See [database.md](./database.md). |
| Users and roles | `FARMER`, `AGRONOMIST`, `ADMIN`. `AGRO_BUSINESS` is seeded, unused. |
| Phone OTP | Kept for later farmer login. Email/password for admins. Not required to join the waitlist until SMS exists. |
| Waiting list | Public `POST /waiting-list/open` creates the user and row. Authenticated `POST /waiting-list` remains. One row per user; `applicantType` is `FARMER` or `AGRONOMIST`. |
| Admin waiting-list APIs | List, filter, approve, reject, bulk-approve. |
| OpenAPI | `/v3/api-docs` and Swagger UI. |
| WhatsApp verify stub | Meta `hub.challenge` only. No bot product. |

Contracts: [api-contract.md](./api-contract.md). Layout: [backend-file-structure.md](./backend-file-structure.md).

### Explicitly not in first ship

- WhatsApp registration, conversations, templates, or image intake
- Farmer profile / farms / fields / crops
- AI diagnosis, FastAPI, object storage
- Agro-business onboarding, inventory, nearest-shop matching
- FarmIT Daily, weather, notifications
- Mobile app and admin dashboard UI (dashboard is Phase 2, against these APIs)
- Gamification, learning, heat maps

---

## Phase 2

Next.js admin dashboard as a client of Spring Boot. Admin login, waiting-list management, nothing talking to PostgreSQL directly.

---

## Later (do not pull into first ship)

| Phase | Outcome |
| :--- | :--- |
| 3 | Farmers, farms, fields, crops; agro-business records |
| 4 | Planting cycles, activities, health foundation |
| 5 | FastAPI diagnosis, `diagnosis_catalog` + `diagnosis_products`, inventory, nearest supplier |
| 6 | FarmIT Daily, weather, recommendations |
| 7 | Mobile application |
| 8 | WhatsApp product depth on the same account |
| 9 | Gamification and learning |
| 10 | Heat maps and extracted intelligence |

`diagnosis_products` is designed in [database.md](./database.md) now so Phase 5 does not invent a single `target_diagnosis` column. It is not a Phase 1 table.
