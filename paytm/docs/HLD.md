# High-Level Design (HLD)

## Recharge System (Paytm-dummy)

**Version:** 1.0
**Type:** Full-stack web application (monolith)
**Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4
**Backend:** Next.js API Routes (same codebase as frontend)
**Database:** PostgreSQL
**ORM:** Prisma 7 (with `@prisma/adapter-pg`)
**Auth:** JWT stored in an HTTP-only cookie
**Payments:** Razorpay (Checkout + Orders API)

---

## 1. Purpose

The Recharge System is a mock "Paytm-style" prepaid mobile recharge platform. It lets a
registered user log in, submit a recharge for a mobile number, pay for it via Razorpay,
and track the recharge status (`PENDING → SUCCESS/FAILED`) in near real time on a
dashboard, along with a filterable recharge history.

Core goals (from the PRD):
- Secure authentication (JWT + HTTP-only cookies)
- Simple recharge submission flow
- Prevent duplicate/accidental recharge requests
- Live status updates without manual refresh (polling)
- Persistent, filterable recharge history

---

## 2. Architecture Style

**Single deployable Next.js application** that serves both the UI (React Server/Client
Components under `src/app`) and the backend (Next.js Route Handlers under
`src/app/api/**`). There is no separate backend service — this is a **modular
monolith** running on a Node.js server (e.g. Vercel or any Node host).

```
                              ┌─────────────────────────────────────────┐
                              │              Browser (Client)            │
                              │  React Components (Dashboard, Forms,     │
                              │  History, Filters) + Razorpay Checkout.js│
                              └───────────────┬───────────────────────────┘
                                              │ HTTPS (fetch/axios, cookies)
                                              ▼
                              ┌─────────────────────────────────────────┐
                              │            Next.js Application            │
                              │  ┌───────────────┐   ┌──────────────────┐ │
                              │  │  Middleware /  │   │   App Router      │ │
                              │  │  proxy.js      │   │  Pages (SSR/CSR)  │ │
                              │  │  (route guard) │   │  /, /login,       │ │
                              │  └───────┬────────┘   │  /register,       │ │
                              │          │            │  /dashboard       │ │
                              │          │            └──────────────────┘ │
                              │          ▼                                 │
                              │  ┌────────────────────────────────────┐   │
                              │  │        API Route Handlers          │   │
                              │  │  /api/auth/*  /api/recharge        │   │
                              │  │  /api/payment/verify|failed        │   │
                              │  └───────────────┬────────────────────┘   │
                              │                  │                        │
                              │   ┌──────────────┼───────────────┐        │
                              │   ▼              ▼               ▼        │
                              │ lib/jwt.js   lib/auth.js    lib/razorpay.js│
                              │ (sign/verify) (session read) (orders API) │
                              └───────────────┬────────────────┬──────────┘
                                              │                │
                          Prisma Client       │                │  Razorpay REST API
                       (adapter-pg, pooled)   ▼                ▼  (orders, checkout,
                              ┌─────────────────────┐   ┌───────────────────┐
                              │   PostgreSQL DB       │   │   Razorpay        │
                              │  User, Recharge       │   │  (external SaaS)  │
                              └─────────────────────┘   └───────────────────┘
```

---

## 3. Major Components

| Layer | Component | Responsibility |
|---|---|---|
| Presentation | `app/page.jsx`, `app/login`, `app/register`, `app/dashboard` | Public landing, auth pages, protected dashboard |
| Presentation | `components/*` (Navbar, WelcomeSection, RechargeForm, RechargeHistory, FilterBar, SummaryCards, StatusBadge) | Reusable UI building blocks |
| Access control | `src/proxy.js` (Next.js middleware) | Guards `/dashboard/**`; redirects unauthenticated users to `/login` |
| API layer | `app/api/auth/{register,login,logout}` | User signup/signin/signout, cookie issuance |
| API layer | `app/api/recharge` | Create recharge (+ Razorpay order), list/filter/paginate recharge history, aggregate stats |
| API layer | `app/api/payment/{verify,failed}` | Confirm/deny a Razorpay payment against a recharge record |
| Domain/services (client-side) | `services/auth.js`, `services/recharge.js` | Thin axios wrappers used by client components to call the API |
| Core libs | `lib/jwt.js`, `lib/auth.js`, `lib/prisma.js`, `lib/razorpay.js`, `lib/axios.js` | JWT sign/verify, session extraction, Prisma singleton, Razorpay SDK client, axios instance |
| Validation | `validations/authValidation.js`, `validations/rechargeValidation.js` | Zod schemas shared by client forms and server routes |
| Data | `prisma/schema.prisma` + migrations | `User` and `Recharge` tables, enums for `Operator`/`RechargeStatus` |
| External | Razorpay | Payment gateway (order creation, hosted checkout, signature-based verification) |

---

## 4. Key Flows

### 4.1 Authentication
1. User registers (`POST /api/auth/register`) → password hashed with bcrypt → user row
   created → JWT generated and set as an HTTP-only cookie (`token`, 1h expiry).
2. User logs in (`POST /api/auth/login`) → credentials verified → same JWT cookie issued.
3. `src/proxy.js` (Next.js middleware) intercepts requests to `/dashboard/*`, checks the
   `token` cookie, verifies the JWT, and redirects to `/login` if missing/invalid.
4. Each API route re-validates the session server-side via `lib/auth.js` (`auth()` reads
   the cookie and verifies the JWT) — the middleware is a UX-level guard, not the sole
   authorization boundary.
5. Logout (`POST /api/auth/logout`) clears the cookie.

### 4.2 Recharge creation & payment
1. User fills the recharge form (mobile number, operator, amount); client-side Zod
   validation mirrors the server schema.
2. `POST /api/recharge`:
   - Re-validates input with `rechargeSchema`.
   - Authenticates the user via `auth()`.
   - Checks for a duplicate recharge (same user, mobile, operator, amount within the
     last 10 seconds) → rejects with `409` if found.
   - Generates a `transactionId`.
   - Creates a Razorpay Order (`razorpay.orders.create`) for the amount.
   - Persists a `Recharge` row with `status = PENDING` and the `razorpayOrderId`.
3. Client opens Razorpay's hosted Checkout using the returned order details.
4. On successful payment, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`,
   `razorpay_signature` to the client, which posts them to `POST /api/payment/verify`.
5. `payment/verify` recomputes the HMAC-SHA256 signature server-side using
   `RAZORPAY_KEY_SECRET` and compares it to the one supplied — if it matches, the
   matching `Recharge` is updated to `status = SUCCESS` with the `razorpayPaymentId`.
6. If checkout fails/is dismissed, the client calls `POST /api/payment/failed`, which
   marks the `Recharge` as `FAILED`.

### 4.3 Live status & history
1. Dashboard polls `GET /api/recharge` while a recharge is `PENDING` (`hasPending` flag
   returned by the API drives whether the client keeps polling).
2. The same endpoint supports filtering (`operator`, `date`), pagination (`page`,
   `limit`), and returns aggregate `statistics` (total/success/pending/failed) used by
   the summary cards.
3. Polling stops once no recharges remain `PENDING`.

---

## 5. Data Model (logical)

```
User
 ├─ id (uuid, PK)
 ├─ name
 ├─ email (unique)
 ├─ password (bcrypt hash)
 ├─ phoneNumber (unique)
 ├─ createdAt / updatedAt
 └─ 1..* Recharge

Recharge
 ├─ id (uuid, PK)
 ├─ userId (FK → User.id)
 ├─ mobileNumber
 ├─ operator (enum: JIO | AIRTEL | VI | BSNL)
 ├─ amount (float)
 ├─ status (enum: PENDING | SUCCESS | FAILED, default PENDING)
 ├─ transactionId (unique)
 ├─ razorpayOrderId (nullable)
 ├─ razorpayPaymentId (nullable)
 └─ createdAt / updatedAt
```

Indexes: `User.email`, `User.phoneNumber`, `Recharge.userId`, `Recharge.mobileNumber`,
`Recharge.status`.

---

## 6. Cross-Cutting Concerns

- **Security**: bcrypt password hashing, JWT signed with `JWT_SECRET`, HTTP-only +
  `Secure` (in production) cookies, server-side re-validation on every protected route,
  Razorpay payment authenticity verified via HMAC signature (never trusted from the
  client alone).
- **Validation**: Zod schemas shared conceptually between client and server
  (`authValidation.js`, `rechargeValidation.js`) to keep error messages consistent and
  reject bad input early.
- **Idempotency / duplicate protection**: a time-windowed (10s) uniqueness check on
  (`userId`, `mobileNumber`, `operator`, `amount`) prevents double-submits.
- **Observability**: `console.error` logging in every route's `catch` block; no external
  APM configured — the project is a training/demo build (`README.md` states this is a
  `create-next-app` bootstrap).
- **Scalability**: stateless API routes + a pooled Postgres connection
  (`@prisma/adapter-pg`) allow horizontal scaling of the Node process; Razorpay handles
  payment-processing scale externally.
- **Configuration**: environment variables — `DATABASE_URL`, `JWT_SECRET`,
  `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

---

## 7. Deployment View

- Single Next.js app (SSR/CSR hybrid) deployable to Vercel or any Node-compatible host.
- PostgreSQL as a managed/external database (migrations tracked under
  `src/prisma/migrations`).
- Razorpay as an external, third-party payment SaaS reached over HTTPS from both the
  server (Orders API) and the browser (Checkout.js script).

---

## 8. Out of Scope / Future Work (per PRD & docs)

- User profile management (`GET/PUT /api/profile`, `DELETE /api/account`)
- Recharge cancellation (`POST /api/recharge/cancel`)
- Dashboard-level aggregate stats endpoint (`GET /api/dashboard/stats`)
- Fetching a single recharge by id (`GET /api/recharge/:id`)
- Refresh tokens / long-lived sessions (current JWT expiry is a fixed 1 hour)
