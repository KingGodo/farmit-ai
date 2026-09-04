---
title: FarmIT 1.0 — System Specification & Technology Architecture
created: 2026-08-24
author: AI-assisted
last_updated: 2026-08-25
updated_by: AI-assisted
status: draft
---

# FarmIT 1.0 — System Specification & Technology Architecture

**Project:** FarmIT  
**Version:** 1.0  
**Document Type:** Product & Technical Specification  
**Status:** Proposed Architecture  
**Date:** 24 August 2026  
**Last aligned:** 25 August 2026

Canonical companions (these win when they conflict with this spec):

- [backend-file-structure.md](./backend-file-structure.md) — Spring package tree (`com.farmitai.farmitai_backend`)
- [database.md](./database.md) — Flyway V1 + reserved `diagnosis_products`
- [api-contract.md](./api-contract.md) — auth, waiting list, error envelope
- [features.md](./features.md) — first ship vs later

---

## 1. Executive Summary

FarmIT is an AI-powered digital agriculture platform designed to help **farmers** make better farming decisions through accessible technology.

FarmIT 1.0 is a **fresh start**. The product will be built as a complete farmer-first agricultural platform with a **Spring Boot backend, admin dashboard, WhatsApp bot, mobile application, AI services, weather intelligence, personalized recommendations, farm management, nearby agro-business matching, notifications, learning, and gamification**.

Farmers are the primary users. Agro businesses can join FarmIT so that when a farmer has a problem — especially after image analysis — a nearby agro business is prioritised for the chemicals and inputs the farmer needs.

**Build order (first):**

1. Create the **Spring Boot** backend (`farmitai-backend`).
2. Host it on a **DigitalOcean Droplet** with Flyway and OpenAPI.
3. Ship **phone OTP auth** so farmers can register and **join the waiting list**.
4. Ship **admin waiting-list APIs** (list, approve, reject, bulk-approve).
5. Stub **WhatsApp webhook verification** only. No chatbot product in first ship.
6. Then build the **admin dashboard** against that API. The dashboard does not hold business logic or talk to PostgreSQL directly.

The core principle of FarmIT 1.0 is:

> **FarmIT should become a farmer's daily digital farming companion, not just a disease-detection tool.**

The central engagement feature will be **FarmIT Daily**, which gives each farmer personalized information and recommended actions based on their crops, farm location, crop growth stage, weather, previous activities, disease observations, and other available data.

The web dashboard is the **admin** surface. It handles all administration through Spring Boot, including waiting-list management, users, and later heat maps and extracted information.

---

# 2. Product Vision

FarmIT aims to make agricultural knowledge and intelligent decision-making accessible to farmers through platforms they already use.

The long-term vision is to provide farmers with a system that can answer:

- What should I do today?
- How healthy is my farm?
- What risks should I watch for?
- Is the weather suitable for today's activity?
- Is my crop showing signs of disease?
- What should I do after identifying a disease?
- Where can I get the right chemical or input nearby?
- What stage is my crop currently in?
- What farming activity should I perform next?
- How is my farm performing over time?

FarmIT should combine **AI, agricultural knowledge, weather data, farm records, nearby agro-business inventory, and personalized recommendations** into one experience.

After a diagnosis, FarmIT should not stop at naming the problem. It should help the farmer act: recommend treatment and **prioritise a nearby agro business** that can supply the relevant chemical or input.

---

# 3. FarmIT 1.0 Goals

## Primary Goals

1. Build the Spring Boot backend first and host it on a DigitalOcean Droplet.
2. Ship phone OTP authentication so farmers can join the waiting list.
3. Give administrators waiting-list APIs, then a dashboard that performs all admin work through Spring Boot.
4. Verify the WhatsApp webhook on Spring Boot; chatbot product depth comes later.
5. Build a unified agricultural platform for farmers.
6. Provide personalized daily farming recommendations.
7. Enable farmers to manage farms, fields, crops, and farming activities.
8. Support AI-powered crop disease detection.
9. After diagnosis, match the farmer to nearby agro businesses for chemicals and inputs.
10. Provide access through both mobile and WhatsApp.
11. Provide a web dashboard for administration, heat maps, and extracted agricultural intelligence.
12. Let agro businesses join FarmIT and serve farmers in their area.
13. Build a central database shared across all FarmIT platforms.
14. Provide weather-based farming intelligence.
15. Introduce gamification and farmer engagement.
16. Build an architecture that can scale as FarmIT grows.

---

# 4. Target Users

## 4.1 Farmers

Farmers are the **primary users**. FarmIT is built for them first.

They should be able to:

- Create an account (auth).
- Join the waiting list.
- Register their farms.
- Register fields.
- Add crops.
- Record planting activities.
- Record farming activities.
- Upload crop images.
- Request AI disease diagnosis.
- See treatment advice after a diagnosis.
- See nearby agro businesses prioritised for the chemicals or inputs they need.
- View recommendations.
- View weather information.
- Receive daily farming tasks.
- Track farm health.
- Receive notifications.
- Complete learning content.
- Earn points and achievements.

---

## 4.2 Agro Businesses

Agro businesses (input suppliers, agro-dealers, chemical and seed retailers) can join FarmIT.

They are not agronomists managing farmer caseloads. They exist on the platform so farmers can get the right product nearby after a problem is identified.

They should be able to:

- Create a business account.
- Register shop or depot locations.
- List chemicals and other farm inputs they stock.
- Be discovered when a nearby farmer receives a matching diagnosis.
- Be prioritised by proximity to the farm.

Admins use the dashboard to view heat maps of crop problems and demand, including in an agro business's catchment, and to extract disease patterns and product-demand information.

When a farmer has a problem — for example after image analysis detects a disease or pest — FarmIT should rank nearby agro businesses that can supply the relevant chemical, and present the closest suitable options first.

---

## 4.3 Administrators

FarmIT staff use the **admin dashboard** for all administration. The dashboard is a client of the Spring Boot API. It does not implement backend logic and does not access PostgreSQL directly.

Administrators will manage:

- Waiting-list farmers.
- Users and roles.
- Farmers.
- Agro businesses.
- Farms.
- Crops.
- Diseases.
- Input/chemical catalogue.
- AI models.
- Learning content.
- Notifications.
- System configuration.
- Heat maps and extracted intelligence.
- WhatsApp bot configuration and conversations.
- Audit logs.

---

# 5. FarmIT Platforms

FarmIT 1.0 will consist of four primary interfaces/services. All of them use the Spring Boot API.

## 5.1 FarmIT Mobile Application

The mobile application will be the primary farmer-facing platform.

Technology:

- React Native
- Expo
- TypeScript

The application will provide:

- Authentication
- Farmer profile
- Farm management
- Crop management
- FarmIT Daily
- Farm health score
- AI crop diagnosis
- Nearby agro businesses for chemicals and inputs
- Weather
- Recommendations
- Notifications
- Farming activities
- Learning
- Gamification
- Profile and settings

---

# 5.2 FarmIT Admin Dashboard

The web dashboard is the **admin application**. It handles everything for administrators. It talks only to the Spring Boot backend.

It is **not** an agronomist workstation and **not** a second backend.

Primary dashboard jobs:

1. **Administration** — waiting list, users, farmers, agro businesses, crops, content, WhatsApp, and system configuration, all via Spring Boot APIs.
2. **Heat maps** — geographic intensity of diagnoses, diseases, pests, crops, and input demand.
3. **Extract information** — reports, trends, and exportable insight.

Technology:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

The dashboard will provide **first** (Phase 2):

- Waiting-list management
- Admin login against Spring Boot

Later dashboard jobs (not first ship):
- User and role administration
- Farmer and agro-business administration
- Heat maps of diagnoses, diseases, pests, and crop problems
- Geographic and time-based extraction of agricultural intelligence
- Agro-business catchment views (nearby farmer problems and product demand)
- Platform analytics
- AI diagnosis overview
- WhatsApp conversation and webhook monitoring
- Learning content management
- Notification management
- System administration

A public marketing site may exist separately. Farmer waiting-list signup goes to Spring Boot auth/waiting-list endpoints, not to a Next.js server route writing to PostgreSQL.

---

# 5.3 FarmIT WhatsApp Bot

The WhatsApp bot will provide FarmIT services to farmers who do not use the mobile application.

WhatsApp is not a separate backend. **Spring Boot owns the WhatsApp endpoints**. WhatsApp Cloud API calls Spring Boot; Spring Boot uses the same users, waiting list, farms, and diagnoses as every other client.

**First ship:** `GET /api/v1/whatsapp/webhook` completes Meta `hub.challenge` verification. `POST` returns 200 and does not persist or reply. See [api-contract.md](./api-contract.md).

When the bot has product depth (Phase 8), it should support:

- Farmer registration / waiting-list join
- Account linking
- Farm information
- Crop information
- Daily farming recommendations
- Weather information
- AI crop diagnosis
- Image submission
- Disease information
- Nearby agro businesses for chemicals and inputs
- Farming advice
- Notifications
- Basic farm activity recording

The WhatsApp interface and mobile application should use the same underlying FarmIT account and data.

For example, a farmer should be able to:

1. Register through WhatsApp.
2. Later install the mobile application.
3. Log into the same account.
4. See the same farm, crops, diagnoses, nearby agro businesses, and recommendations.

---

# 5.4 FarmIT AI Service

AI will be implemented as a specialized service rather than being tightly coupled to the main backend.

Technology:

- Python
- FastAPI
- TensorFlow and/or other appropriate ML frameworks
- Crop disease models
- Future ML/AI models

The AI service will handle tasks such as:

- Crop disease detection
- Image classification
- Crop health analysis
- AI-assisted recommendations
- Suggested chemicals/inputs after diagnosis
- Future predictive agriculture models

---

# 6. Recommended System Architecture

The recommended architecture is a **modular monolith with a separate AI service**.

```text
                         FARMIT USERS
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
       React Native       WhatsApp          Next.js
        Mobile App         Cloud API      Admin Dashboard
             |                |                |
             +----------------+----------------+
                              |
                              v
                    Spring Boot REST API
                    (auth, waiting list,
                     admin, WhatsApp bot)
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
     PostgreSQL          AI / FastAPI         External APIs
      Database              Service             Weather
          |
          v
     FarmIT Data
```

Spring Boot is built and hosted first. It is the only business backend.

PostgreSQL is the central source of truth.

The admin dashboard is a Next.js client of Spring Boot.

WhatsApp Cloud API webhooks hit Spring Boot (`/api/v1/whatsapp`).

FastAPI will later provide specialized AI/ML capabilities.

---

# 7. Technology Stack

## 7.1 Mobile Application

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile development |
| Expo | Mobile development and deployment |
| TypeScript | Type-safe development |
| Expo Router | Application navigation |
| NativeWind | Styling |
| React Query / TanStack Query | API state management |
| Firebase Cloud Messaging / Expo Notifications | Push notifications |

Target platforms:

- Android
- iOS

Android should be prioritized initially because of the target farmer market.

---

# 7.2 Admin Dashboard

| Technology | Purpose |
|---|---|
| Next.js | Admin web application |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| TanStack Query | API state management against Spring Boot |
| Recharts | Charts and extracted metrics |
| Map library (e.g. Mapbox / Leaflet) | Heat maps and geographic intelligence |

The dashboard has no separate business API. All reads and writes go through Spring Boot.

---

# 7.3 Main Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot | Main backend framework |
| Spring Web | REST APIs |
| Spring Security | Authentication and authorization |
| JWT | Stateless authentication |
| Spring Data JPA | Database access |
| Hibernate | ORM |
| Bean Validation | Request validation |
| OpenAPI / Swagger | API documentation |
| Maven | Dependency/build management |

Spring Boot will contain the main business logic for FarmIT.

---

# 7.4 Database

Primary database:

**PostgreSQL**

The database will store:

- Users
- Farmers
- Waiting-list entries
- Farms
- Fields
- Crops
- Planting cycles
- Activities
- Diagnoses
- Images/metadata
- Recommendations
- Agro businesses
- Agro-business locations
- Input/chemical catalogue
- Diagnosis-to-supplier matches
- Weather data
- Daily briefings
- Notifications
- Gamification
- Learning progress
- WhatsApp conversations
- System configuration
- Audit records

---

# 7.5 AI Service

| Technology | Purpose |
|---|---|
| Python | AI/ML development |
| FastAPI | AI REST API |
| TensorFlow | Deep learning models |
| scikit-learn | Machine learning |
| LightGBM | Predictive models where appropriate |
| Pillow/OpenCV | Image processing |

The AI service should remain independently deployable from Spring Boot.

---

# 7.6 Infrastructure

FarmIT 1.0 starts on a **DigitalOcean Droplet**. The first deploy is Spring Boot and PostgreSQL. The admin dashboard and later FastAPI join the same droplet.

Initial deployment can use:

- DigitalOcean Droplet
- Ubuntu Linux
- Docker
- Docker Compose
- Nginx
- PostgreSQL
- SSL/TLS
- GitHub

First infrastructure (Phase 1):

```text
DigitalOcean Droplet
|
+-- Nginx
|
+-- Spring Boot
|     /api/v1/auth
|     /api/v1/waiting-list
|     /api/v1/admin
|     GET /api/v1/whatsapp/webhook  (verify stub)
|
+-- PostgreSQL
```

Then add:

```text
+-- Next.js admin dashboard
+-- FastAPI (AI, later)
```

For production growth, PostgreSQL and other services can later be moved to managed infrastructure or separate servers.

---

# 8. Core Database Architecture

The database should be organized around the farmer and their agricultural data. **Flyway V1 creates only identity + waiting list.** Other domains below are the long-term map; they are not first-ship tables. See [database.md](./database.md).

## Main domains

```text
identity
farmer
agro_business
agriculture
ai
whatsapp
daily_farm
weather
gamification
notifications
learning
administration
waiting_list
```

---

# 9. Identity Domain

## users

Stores the main FarmIT user identity. Phone is required (E.164). `password_hash` is nullable — farmers authenticate with OTP. Admins use email + password.

Columns and constraints: [database.md](./database.md).

## roles

Stores system roles.

Examples:

- FARMER
- AGRONOMIST
- AGRO_BUSINESS
- ADMIN

## user_roles

Connects users with roles.

---

# 10. Farmer Domain

## farmer_profiles

Stores farmer-specific information.

Fields:

- id
- user_id
- first_name
- last_name
- location
- district
- province
- country
- profile_image
- preferences
- created_at

## farms

A farmer can have multiple farms.

Fields:

- id
- farmer_id
- name
- description
- latitude
- longitude
- area_hectares
- location
- district
- province
- created_at

## farm_fields

Represents individual fields within a farm.

Fields:

- id
- farm_id
- name
- area_hectares
- latitude
- longitude
- soil_type
- created_at

---

# 11. Agro Business Domain

Agro businesses join FarmIT so farmers can obtain the right chemical or input nearby after a problem is identified.

A farmer diagnosis should trigger matching: needed product → businesses that stock it → **nearest locations first**.

## agro_businesses

Stores the agro-business organisation.

Fields:

- id
- user_id
- name
- description
- phone
- email
- status
- created_at
- updated_at

## agro_business_locations

A business can have multiple shops or depots.

Fields:

- id
- agro_business_id
- name
- address
- latitude
- longitude
- district
- province
- country
- created_at

Proximity ranking uses the farm (or field) coordinates against these locations.

## input_products

Catalogue of chemicals and other farm inputs that can be matched to diagnoses.

Fields:

- id
- name
- product_type
- active_ingredient
- crop_id
- description
- created_at

Product types can include pesticide, herbicide, fungicide, fertilizer, seed, and other inputs.

Do **not** store a single `target_diagnosis` on the product. Mapping is many-to-many:

## diagnosis_catalog

Canonical problem types (e.g. Fall Armyworm). Farmer diagnosis rows FK here.

Fields:

- id
- code
- name
- kind (DISEASE, PEST, DEFICIENCY, OTHER)
- crop_id (optional)
- description

## diagnosis_products

Fields:

- id
- diagnosis_catalog_id
- product_id
- crop_id (optional, narrower than catalog)
- is_primary
- sort_order
- notes

Specified now in [database.md](./database.md). Migrated with the input catalogue in Phase 5, not in Flyway V1.

## agro_business_inventory

What a specific location currently stocks.

Fields:

- id
- agro_business_id
- location_id
- product_id
- in_stock
- updated_at

## diagnosis_supplier_matches

Stores the ranked nearby agro businesses shown to a farmer after diagnosis.

Fields:

- id
- diagnosis_id
- farmer_id
- farm_id
- agro_business_id
- location_id
- product_id
- distance_km
- rank
- created_at

Matching rules:

1. Identify the disease, pest, or problem from image analysis (`diagnosis_catalog.code`).
2. Resolve recommended chemicals via `diagnosis_products`.
3. Find agro-business locations that stock a matching product.
4. Rank by distance from the farm (Haversine on lat/lng first; PostGIS later).
5. Present the nearest suitable agro businesses first.

```text
Image analysis
      |
      v
Diagnosis + treatment
      |
      v
Required chemical / input
      |
      v
Nearby agro businesses in stock
      |
      v
Prioritise closest to the farm
      |
      v
Farmer sees where to get it
```

---

# 12. Agriculture Domain

## crops

Stores the FarmIT crop catalogue.

Examples:

- Maize
- Groundnuts
- Beans
- Tomatoes
- Tobacco
- Vegetables

Fields:

- id
- name
- scientific_name
- description
- created_at

## crop_varieties

Stores crop varieties.

Fields:

- id
- crop_id
- name
- description

## planting_cycles

Represents a crop planted during a specific farming season.

Fields:

- id
- field_id
- crop_id
- variety_id
- planting_date
- expected_harvest_date
- actual_harvest_date
- quantity_planted
- status

This table is critical for determining crop age and growth stage.

## farm_activities

Stores farming activities.

Examples:

- Planting
- Irrigation
- Fertilization
- Weeding
- Spraying
- Pest control
- Inspection
- Harvesting

Fields:

- id
- farmer_id
- farm_id
- field_id
- planting_cycle_id
- activity_type
- description
- activity_date
- notes
- created_at

---

# 13. AI Domain

## ai_models

Stores model information.

Fields:

- id
- name
- version
- model_type
- status
- accuracy
- deployed_at

## diagnoses

Stores AI diagnosis results.

Fields:

- id
- farmer_id
- farm_id
- field_id
- crop_id
- planting_cycle_id
- model_id
- diagnosis
- confidence
- severity
- status
- created_at

## diagnosis_images

Stores image metadata.

Fields:

- id
- diagnosis_id
- image_url
- image_hash
- created_at

Images should preferably be stored in object storage rather than directly inside PostgreSQL.

---

# 14. Recommendation Engine

## recommendations

Stores personalized recommendations.

Fields:

- id
- farmer_id
- farm_id
- field_id
- diagnosis_id
- type
- title
- description
- priority
- source
- status
- created_at
- expires_at

Recommendation sources can include:

- AI
- Weather
- Crop growth stage
- Agricultural rules
- Farmer activity
- Disease risk
- Pest risk
- Nearby agro-business inventory

After an AI diagnosis, a recommendation should include:

1. The identified problem.
2. The recommended treatment or chemical.
3. Nearby agro businesses that stock it, **prioritised by distance to the farm**.

---

# 15. FarmIT Daily

FarmIT Daily is the main daily engagement feature.

## daily_briefings

Fields:

- id
- farmer_id
- date
- farm_health_score
- summary
- created_at

## daily_tasks

Fields:

- id
- briefing_id
- farm_id
- field_id
- title
- description
- task_type
- priority
- status
- completed_at

Example:

```text
Good morning!

Farm Health: 82/100

Today's priorities:

1. Inspect maize leaves.
2. Check soil moisture.
3. Review tomorrow's rainfall.
4. Monitor for fall armyworm.
```

---

# 16. Farm Health Score

## farm_health_scores

Stores calculated health metrics.

Fields:

- id
- farm_id
- field_id
- score
- crop_health_score
- weather_score
- activity_score
- pest_risk_score
- disease_risk_score
- calculated_at

The score can evolve as FarmIT's intelligence improves.

---

# 17. WhatsApp Domain

## whatsapp_accounts

Fields:

- id
- user_id
- phone_number
- whatsapp_id
- status
- linked_at

## conversations

Fields:

- id
- user_id
- channel
- started_at
- last_message_at

## messages

Fields:

- id
- conversation_id
- sender
- message_type
- content
- media_url
- status
- created_at

This allows FarmIT to retain relevant conversation history and connect WhatsApp activity with the farmer's main account.

---

# 18. Weather Domain

## weather_locations

Fields:

- id
- farm_id
- latitude
- longitude

## weather_forecasts

Fields:

- id
- location_id
- forecast_date
- temperature
- rain_probability
- rainfall
- humidity
- wind_speed
- weather_condition
- fetched_at

Weather data should be cached instead of requesting external weather services every time a farmer opens the application.

---

# 19. Gamification

Gamification will encourage farmers to use FarmIT regularly.

## points

Fields:

- id
- user_id
- points
- reason
- reference_type
- reference_id
- created_at

## achievements

Fields:

- id
- name
- description
- icon
- points_required

## user_achievements

Fields:

- id
- user_id
- achievement_id
- earned_at

## streaks

Fields:

- id
- user_id
- current_streak
- longest_streak
- last_activity_date

Examples:

- 7-Day FarmIT Streak
- First Diagnosis
- First Farm Added
- 10 Activities Completed
- Maize Master

---

# 20. Notifications

## notifications

Fields:

- id
- user_id
- title
- message
- type
- priority
- read
- created_at

Notification examples:

- Weather alerts
- Pest warnings
- Disease alerts
- Nearby agro business for a diagnosed problem
- Daily tasks
- Farm activity reminders
- Achievement notifications

---

# 21. Learning

FarmIT can eventually include an agricultural learning platform.

## lessons

Fields:

- id
- title
- description
- crop_id
- difficulty
- content

## user_progress

Fields:

- id
- user_id
- lesson_id
- progress
- completed
- completed_at

Future functionality can include:

- Lessons
- Videos
- Quizzes
- Crop guides
- Pest identification guides
- Disease guides

---

# 22. Waiting List

The waiting list is a **Spring Boot** feature from day one. Farmers authenticate, then join. There is no temporary Next.js-to-PostgreSQL path.

First endpoints to ship (contracts in [api-contract.md](./api-contract.md)):

```text
/api/v1/auth/otp/request
/api/v1/auth/otp/verify
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/waiting-list
/api/v1/admin/waiting-list
GET /api/v1/whatsapp/webhook   (Meta verify only)
```

Admins review and manage waiting-list farmers from the dashboard, which calls `/api/v1/admin/waiting-list`.

WhatsApp registration onto the same waiting list is Phase 8, not first ship.

## waiting_list

Fields:

- id
- user_id
- name
- phone
- email
- location
- farming_type
- status
- created_at

Architecture (first ship — WhatsApp join is Phase 8):

```text
Farmer (OTP) or Admin (email)
   |
   v
Spring Boot
   /api/v1/auth
   /api/v1/waiting-list
   GET /api/v1/whatsapp/webhook  (verify stub)
   |
   v
PostgreSQL

Admin Dashboard (Next.js, Phase 2)
   |
   v
Spring Boot
   /api/v1/admin/waiting-list
   |
   v
PostgreSQL
```

A waiting-list farmer is a real FarmIT user. When the product opens, the same account continues — it is not a separate identity to migrate later.

---

# 23. API Architecture

Spring Boot should expose versioned REST APIs.

Example:

```text
/api/v1/auth
/api/v1/waiting-list
/api/v1/users
/api/v1/farmers
/api/v1/farms
/api/v1/fields
/api/v1/crops
/api/v1/planting-cycles
/api/v1/activities
/api/v1/diagnoses
/api/v1/recommendations
/api/v1/agro-businesses
/api/v1/inputs
/api/v1/daily
/api/v1/weather
/api/v1/notifications
/api/v1/gamification
/api/v1/learning
/api/v1/whatsapp
/api/v1/intelligence
/api/v1/admin
```

The first production endpoints are **auth (phone OTP + admin login)**, **waiting-list**, **admin waiting-list**, and a **WhatsApp verification stub**. The rest follow as later phases land. Do not add farm or diagnosis routes until those contracts exist.

---

# 24. AI Communication

Spring Boot should communicate with FastAPI.

Example:

```text
Mobile App
    |
    | Upload crop image
    v
Spring Boot
    |
    | Validate user
    | Save request
    v
FastAPI
    |
    | Run ML model
    v
Prediction
    |
    v
Spring Boot
    |
    | Save diagnosis
    | Generate treatment recommendation
    | Match nearby agro businesses for the chemical
    | Prioritise closest locations in stock
    v
Mobile App / WhatsApp
```

Example AI response:

```json
{
  "diagnosis": "Fall Armyworm",
  "confidence": 0.9139,
  "severity": "MEDIUM",
  "recommended_input": "Emamectin benzoate insecticide",
  "nearby_suppliers": [
    {
      "agro_business": "Example Agro Shop",
      "distance_km": 4.2,
      "rank": 1
    }
  ]
}
```

The `nearby_suppliers` list is produced by Spring Boot after the model result, using farm location and agro-business inventory. The nearest suitable agro business is ranked first.

---

# 25. FarmIT Daily Intelligence

FarmIT Daily should combine several data sources.

```text
             Crop Data
                 |
                 v
Weather ---> Recommendation Engine <--- AI Diagnosis
                 |
                 +---- Farm Activities
                 |
                 +---- Growth Stage
                 |
                 +---- Pest Risk
                 |
                 +---- Disease Risk
                 |
                 +---- Nearby agro businesses
                 |
                 v
          Daily Farm Briefing
```

This allows FarmIT to move beyond simple AI image classification: a diagnosis should lead to an action, including where to get the chemical nearby.

---

# 26. Authentication

The recommended authentication flow is:

```text
Farmer (phone OTP) / Admin (email)
    |
    v
Spring Boot (Spring Security)
    |
    v
JWT Access Token
    |
    v
Authenticated API Requests
    |
    +-- /api/v1/waiting-list
    +-- /api/v1/admin/waiting-list
```

Auth is the first endpoint group to ship so farmers can register with OTP and join the waiting list.

The admin dashboard authenticates against the same Spring Boot auth APIs.

For farmers, **phone + OTP is the default**. Email and password are for administrators (and later agro businesses). JWT access tokens are short-lived; refresh tokens are rotated.

Possible authentication methods:

- Phone + OTP (farmers, first ship)
- Email + password (admins, first ship)
- WhatsApp account linking (Phase 8)
- Google (later)

---

# 27. File and Image Storage

Images should not be stored directly inside PostgreSQL.

Recommended architecture:

```text
Mobile / WhatsApp
       |
       v
Spring Boot
       |
       v
Object Storage
       |
       +---- Crop Images
       +---- Profile Images
       +---- Diagnosis Images
```

PostgreSQL should store the image URL and metadata.

Possible storage technologies:

- DigitalOcean Spaces
- Amazon S3
- Cloudflare R2
- Other S3-compatible storage

---

# 28. Security Requirements

FarmIT will handle personal and agricultural data, so security should be included from the beginning.

Requirements:

- HTTPS everywhere
- Password hashing
- JWT authentication
- Role-based access control
- Input validation
- API rate limiting
- Secure file uploads
- SQL injection protection
- CORS configuration
- Environment variables for secrets
- Database backups
- Audit logging
- Secure PostgreSQL configuration
- Do not expose PostgreSQL directly to the public internet

---

# 29. Initial Deployment Architecture

For the first production version, a DigitalOcean Droplet hosts Spring Boot and PostgreSQL.

```text
Internet
    |
    v
Nginx
    |
    +------------------+------------------+
    |                  |                  |
    v                  v                  v
Admin Dashboard   Spring Boot      WhatsApp Cloud API
   (Next.js)           |               (webhooks)
                       |
                       v
                  PostgreSQL
```

FastAPI is added later for AI.

Docker Compose can be used to manage the services.

As FarmIT grows, services can be separated.

---

# 30. Scalability Strategy

FarmIT should begin as a modular monolith rather than immediately adopting microservices.

Initial:

```text
Spring Boot
PostgreSQL
```

Then:

```text
Next.js admin dashboard
Spring Boot
PostgreSQL
FastAPI
```

Later, high-load components can be extracted.

Possible future services:

```text
Authentication Service
Farm Service
AI Service
Agro Business Service
Recommendation Service
Notification Service
Weather Service
Intelligence / Heat Map Service
WhatsApp Service
```

This avoids unnecessary complexity during early development.

---

# 31. Dashboard Heat Maps & Intelligence

The admin dashboard handles **all administration** through Spring Boot. Later it also **shows heat maps and extracts information**. It is not a tool for agronomists to manage individual farmer cases.

Admins should be able to see where problems are clustering and export that intelligence.

### Heat maps

- Diagnosis intensity by district, ward, or coordinates
- Disease and pest outbreak clusters
- Crop-specific problem maps (for example maize fall armyworm)
- Farm health by geography
- Chemical and input demand inferred from diagnoses
- Agro-business catchment: nearby farmer problems that match their inventory

### Extracted information

- Common diseases in a selected area and time range
- Crops most affected
- Product demand signals for agro businesses
- Geographic distribution of farmers and farms
- Diagnosis volume, confidence, and model performance
- Exportable reports (CSV / dashboard views)

### Platform metrics

- Total farmers
- Active farmers
- Agro businesses onboarded
- New registrations
- Daily active users
- Monthly active users
- Waiting-list registrations

### Engagement

- Daily active farmers
- FarmIT Daily completion rate
- Diagnosis-to-supplier match rate
- Streaks
- Most completed activities
- Learning completion

---

# 32. Recommended Project Structure

## Backend

Canonical layout is [backend-file-structure.md](./backend-file-structure.md). Summary:

```text
farmitai-backend/
|
+-- src/main/java/com/farmitai/farmitai_backend/
|   |
|   +-- common/            dto, exception, config, util
|   +-- infrastructure/    security, client, persistence, storage
|   +-- domain/
|       +-- auth/          PHASE 1
|       +-- user/          PHASE 1
|       +-- waitinglist/   PHASE 1
|       +-- admin/         PHASE 1 (waiting list)
|       +-- whatsapp/      PHASE 1 stub (verify only)
|       +-- farmer/        later
|       +-- crop/
|       +-- planting/
|       +-- activity/
|       +-- diagnosis/     includes diagnosis_catalog usage later
|       +-- agrobusiness/
|       +-- input/         diagnosis_products lives with the catalogue
|       +-- match/
|       +-- daily/         recommendations fold in here until they earn a package
|       +-- weather/
|       +-- notification/
|       +-- gamification/
|       +-- learning/
|       +-- audit/
|
+-- src/main/resources/
|   +-- application.yml
|   +-- db/migration/      Flyway; V1 = identity + waiting list only
|
+-- pom.xml
```

No separate `recommendations` or `intelligence` packages. Heat maps stay admin aggregates in Phase 10.

Flyway owns migrations. Hibernate `ddl-auto` is `validate`.

---

# 33. Mobile Application Structure

```text
farmit-mobile/
|
+-- app/
|   +-- auth/
|   +-- home/
|   +-- farms/
|   +-- crops/
|   +-- diagnosis/
|   +-- suppliers/
|   +-- daily/
|   +-- weather/
|   +-- activities/
|   +-- learning/
|   +-- profile/
|
+-- components/
+-- services/
+-- hooks/
+-- store/
+-- types/
+-- utils/
```

---

# 34. Dashboard Structure

```text
farmit-dashboard/
|
+-- app/
|   +-- dashboard/
|   +-- waiting-list/
|   +-- heatmaps/
|   +-- intelligence/
|   +-- agro-businesses/
|   +-- diagnoses/
|   +-- farmers/
|   +-- farms/
|   +-- crops/
|   +-- whatsapp/
|   +-- analytics/
|   +-- learning/
|   +-- notifications/
|   +-- settings/
|
+-- components/
+-- services/
+-- hooks/
+-- types/
```

---

# 35. Development Phases

## Phase 1 — Spring Boot backend, auth, waiting list

Build first. Host on a DigitalOcean Droplet. Contracts: [api-contract.md](./api-contract.md). Schema: [database.md](./database.md).

- Spring Boot project setup (`farmitai-backend`)
- PostgreSQL connection
- Flyway V1 (users, roles, OTP, refresh tokens, waiting list)
- Docker, Nginx, SSL on the droplet
- Phone OTP for farmers; email/password for admins
- Users and roles
- Farmer waiting-list join
- Admin waiting-list APIs (list, approve, reject, bulk-approve)
- OpenAPI / Swagger
- WhatsApp webhook **verification stub** only (no inbound handling, no replies)

Goal:

> Farmers can register with phone OTP and join the waiting list. Admins can approve them through the API. The backend is live on DigitalOcean with OpenAPI.

---

## Phase 2 — Admin dashboard

Build the Next.js admin dashboard against Spring Boot only.

- Admin login
- Waiting-list management
- User administration
- All admin operations via `/api/v1/admin`
- Deploy the dashboard on the same droplet

WhatsApp conversation monitoring waits until Phase 8. The dashboard handles everything for the admin. It does not talk to PostgreSQL directly.

---

## Phase 3 — Farm foundation

- Farmers
- Agro businesses
- Farms
- Fields
- Crops

---

## Phase 4 — Farm Management

Implement:

- Planting cycles
- Farm activities
- Crop growth stages
- Farm observations
- Farm health foundation

---

## Phase 5 — AI Integration

Add FastAPI and crop diagnosis.

- FastAPI
- Image upload
- AI prediction
- Diagnosis storage
- Confidence score
- Disease history
- Treatment recommendations via `diagnosis_catalog` + `diagnosis_products`
- Agro-business locations and inventory
- Nearby agro-business matching for chemicals and inputs (Haversine first)

---

## Phase 6 — FarmIT Daily

Implement the main engagement engine.

- Daily briefing
- Daily tasks
- Weather integration
- Crop growth stage
- Risk alerts
- Farm health score
- Recommendations

---

## Phase 7 — Mobile Application

Build:

- Authentication
- Home
- Farm management
- Daily briefing
- Crop management
- AI diagnosis
- Nearby agro businesses for chemicals
- Weather
- Notifications
- Activities
- Profile

---

## Phase 8 — WhatsApp product depth

Expand the WhatsApp bot that already runs on Spring Boot.

The bot should use the same:

- User
- Waiting list
- Farm
- Crop
- Diagnosis
- Nearby agro business
- Recommendation
- Weather
- Daily briefing

data as the mobile application.

---

## Phase 9 — Gamification & Learning

Add:

- Points
- Achievements
- Streaks
- Leaderboards if appropriate
- Lessons
- Quizzes
- Farmer education

---

## Phase 10 — Heat Maps, Intelligence & Scale

Build:

- Geographic heat maps of diagnoses and crop problems
- Extractable intelligence for admins
- Input-demand views from diagnosis patterns
- Farmer analytics
- AI analytics
- Performance monitoring
- Advanced notifications

---

# 36. First ship (not the whole product)

The first production ship is **not** the full 1.0 feature list. See [features.md](./features.md).

```text
1. Spring Boot (farmitai-backend) on a DigitalOcean Droplet
2. Flyway + PostgreSQL
3. Users and roles
4. Phone OTP (farmers) and email/password (admins)
5. Farmer waiting list
6. Admin waiting-list APIs
7. OpenAPI
8. WhatsApp webhook verification stub
```

Phase 2 is the admin dashboard against those APIs.

Farmer profile, farms, AI diagnosis, nearby matching, weather, FarmIT Daily, mobile, and WhatsApp product flows are later phases. Gamification, learning, and heat maps follow after the core loop is stable.

---

# 37. Product Differentiation

FarmIT should differentiate itself by combining:

**AI + Weather + Farm Data + Nearby Agro Businesses + Daily Actions**

rather than positioning itself only as an AI disease detector or an agronomist network.

The farmer loop:

```text
Farmer opens FarmIT
        |
        v
Sees today's farm briefing
        |
        v
Completes recommended activities
        |
        v
Records farm activity
        |
        v
FarmIT learns more about the farm
        |
        v
Better recommendations
        |
        v
Farmer returns tomorrow
```

The diagnosis loop:

```text
Farmer sends a crop image
        |
        v
AI identifies the problem
        |
        v
FarmIT recommends treatment
        |
        v
Nearby agro businesses are ranked
        |
        v
Closest shop with the chemical is prioritised
        |
        v
Farmer can act the same day
```

Diagnoses also feed dashboard heat maps so agro businesses and FarmIT can extract where problems are clustering.

This creates a continuous relationship between the farmer, FarmIT, and nearby agro businesses.

---

# 38. Long-Term Vision

FarmIT can eventually evolve into an agricultural intelligence platform capable of providing:

- Personalized farm management
- Crop disease detection
- Nearby chemical and input matching
- Pest prediction
- Weather intelligence
- Yield prediction
- Farm performance analytics
- Heat maps of outbreaks and input demand
- Extractable intelligence for agro businesses
- Agricultural education
- Market information
- Harvest planning
- Farmer communities
- Agricultural financial services integrations

The architecture should therefore be designed to support future expansion without overengineering the initial product.

---

# 39. Final Technology Stack

## Frontend

**Mobile**
- React Native
- Expo
- TypeScript
- NativeWind
- Expo Router

**Web (admin dashboard)**
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Map library for heat maps

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- OpenAPI/Swagger
- Flyway

## Database

- PostgreSQL

## AI

- Python
- FastAPI
- TensorFlow
- scikit-learn
- LightGBM
- OpenCV/Pillow

## Infrastructure

- DigitalOcean
- Ubuntu
- Docker
- Docker Compose
- Nginx
- SSL/TLS
- GitHub
- S3-compatible object storage

## External Integrations

- WhatsApp Cloud API
- Weather API
- Push notification service
- Future agricultural/market data APIs

---

# 40. Architectural Principle

The most important architectural principle for FarmIT 1.0 is:

> **One FarmIT account, one Spring Boot API, one source of truth, multiple ways to access it.**

A farmer should be able to join the waiting list through auth, use WhatsApp, later use the mobile application, and keep the same identity.

The **admin dashboard** is how staff operate the platform. It handles all admin work by calling Spring Boot. WhatsApp is also a Spring Boot endpoint surface, not a second backend.

Agro businesses join the same platform so a diagnosis can connect a farmer to a nearby supplier. The dashboard reads that shared data as heat maps and extracted intelligence.

```text
                    FARMIT
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
     Mobile         WhatsApp     Admin Dashboard
   (farmers)       (farmers)        (admin)
        |              |              |
        +--------------+--------------+
                       |
                Spring Boot API
            auth, waiting list,
            admin; WhatsApp verify stub now,
            WhatsApp product later
                       |
                PostgreSQL
                       |
          +------------+------------+
          |            |            |
     Farm Data     AI Data    Agro businesses
          |            |            |
          +------------+------------+
                       |
            Diagnosis → nearby chemical
                       |
                  FarmIT Daily
                       |
                       v
              Better farming decisions
```

**FarmIT 1.0 is a fresh farmer-first agricultural platform. Spring Boot is the backend. The dashboard is the admin client. WhatsApp is another client of the same API. Farmers get daily advice and diagnoses, nearby agro businesses are prioritised for the chemicals they need, and the dashboard turns that activity into administration, heat maps, and extracted information.**
