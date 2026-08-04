# Low-Level Design (LLD)

## Recharge System (Paytm-dummy)

Companion document to `hld.md`. Describes concrete modules, file responsibilities,
function signatures, request/response contracts, database schema, and sequence flows
as implemented in the codebase (`SW2627-Nextjs-Cloud-Paytm/paytm`).

---

## 1. Project / Folder Structure

```
paytm/
├─ src/
│  ├─ app/
│  │  ├─ page.jsx                     # Public landing page
│  │  ├─ layout.jsx                   # Root layout (fonts, <Toaster/>, globals.css)
│  │  ├─ globals.css
│  │  ├─ login/page.jsx               # Login page (client form)
│  │  ├─ register/page.jsx            # Register page (client form)
│  │  ├─ dashboard/
│  │  │  ├─ page.jsx                  # Server component: reads session, renders Dashboard
│  │  │  └─ Dashboard.jsx             # Client component: composes dashboard widgets
│  │  └─ api/
│  │     ├─ auth/
│  │     │  ├─ register/route.js      # POST /api/auth/register
│  │     │  ├─ login/route.js         # POST /api/auth/login
│  │     │  └─ logout/route.js        # POST /api/auth/logout
│  │     ├─ recharge/route.js         # POST + GET /api/recharge
│  │     └─ payment/
│  │        ├─ verify/route.js        # POST /api/payment/verify
│  │        └─ failed/route.js        # POST /api/payment/failed
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  ├─ WelcomeSection.jsx
│  │  ├─ RechargeForm.jsx
│  │  ├─ RechargeHistory.jsx
│  │  ├─ FilterBar.jsx
│  │  ├─ SummaryCards.jsx
│  │  └─ StatusBadge.jsx
│  ├─ services/
│  │  ├─ auth.js                      # axios wrappers: login/register/logout
│  │  └─ recharge.js                  # axios wrappers: createRecharge/getRecharges
│  ├─ lib/
│  │  ├─ axios.js                     # preconfigured axios instance (baseURL /api)
│  │  ├─ jwt.js                       # generateToken / verifyToken
│  │  ├─ auth.js                      # auth() — server-side session reader
│  │  ├─ prisma.js                    # Prisma client singleton (pg adapter)
│  │  └─ razorpay.js                  # Razorpay SDK client
│  ├─ validations/
│  │  ├─ authValidation.js            # registerSchema, loginSchema, registerApiSchema (Zod)
│  │  └─ rechargeValidation.js        # rechargeSchema (Zod)
│  ├─ proxy.js                        # Next.js middleware — protects /dashboard/*
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/
│  │     ├─ 20260709104055_init/
│  │     └─ 20260726145917_add_razorpay_fields/
│  └─ generated/prisma/               # Prisma-generated client (checked into repo)
├─ docs/
│  ├─ PRD.md
│  ├─ backendArchitecture.md
│  └─ frontendArchitecture.md
├─ package.json
├─ next.config.mjs / jsconfig.json / eslint.config.mjs / postcss.config.mjs
```

---

## 2. Database Schema (Prisma / PostgreSQL)

```prisma
model User {
  id          String     @id @default(uuid())
  name        String
  email       String     @unique
  password    String                 // bcrypt hash
  phoneNumber String     @unique
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  recharges   Recharge[]

  @@index([email])
  @@index([phoneNumber])
}

model Recharge {
  id                String         @id @default(uuid())
  userId            String
  user              User           @relation(fields: [userId], references: [id])
  mobileNumber      String
  operator          Operator
  amount            Float
  status            RechargeStatus @default(PENDING)
  transactionId     String         @unique
  razorpayOrderId   String?
  razorpayPaymentId String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  @@index([userId])
  @@index([mobileNumber])
  @@index([status])
}

enum Operator { JIO AIRTEL VI BSNL }
enum RechargeStatus { PENDING SUCCESS FAILED }
```

Migrations: `20260709104055_init` (base tables) →
`20260726145917_add_razorpay_fields` (adds `razorpayOrderId`, `razorpayPaymentId`).

Prisma client is instantiated once as a global singleton via `@prisma/adapter-pg`
(`lib/prisma.js`) to avoid connection exhaustion in dev hot-reload.

---

## 3. Core Library Functions

### `lib/jwt.js`
```js
generateToken(payload) -> string        // jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
verifyToken(token) -> object | null     // jwt.verify, returns null on failure (never throws)
```
JWT payload shape: `{ id, name, email }`.

### `lib/auth.js`
```js
async auth() -> { id, name, email } | null
```
Reads the `token` cookie via `next/headers` `cookies()`, delegates to `verifyToken`.
Used inside API route handlers (server-side authorization), **not** in middleware.

### `src/proxy.js` (Next.js middleware)
```js
proxy(req) -> NextResponse
config.matcher = ["/dashboard/:path*"]
```
Reads the `token` cookie directly, verifies with `jsonwebtoken.verify` (duplicated logic
from `lib/jwt.js`, not reused), redirects to `/login` on missing/invalid token, otherwise
`NextResponse.next()`.

### `lib/prisma.js`
Singleton `PrismaClient` using `PrismaPg` adapter with `DATABASE_URL`; cached on
`globalThis.prisma` outside production to survive HMR.

### `lib/razorpay.js`
```js
razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
```

### `lib/axios.js`
Preconfigured axios instance (base URL `/api`, `withCredentials` for cookie auth) used
by all `services/*` functions.

---

## 4. Validation Schemas (Zod)

### `validations/authValidation.js`
- `registerSchema` (client form, includes `confirmPassword` cross-check via
  `superRefine`): `name` (required), `email` (valid email), `phoneNumber`
  (`^\d{10}$`), `password` (min 8), `confirmPassword` (must match).
- `loginSchema`: `email` (valid), `password` (required, non-empty).
- `registerApiSchema` (server-side, no `confirmPassword`): `name`, `email`,
  `phoneNumber` (`^\d{10}$`), `password` (min 8).

### `validations/rechargeValidation.js`
- `rechargeSchema`: `mobileNumber` (`^\d{10}$`), `operator` (must be one of
  `JIO | AIRTEL | VI | BSNL`), `amount` (non-empty, numeric, `> 0`).

---

## 5. API Contracts

All responses: `{ success: boolean, message?: string, ... }`. Errors return
`success: false` with an appropriate HTTP status; validation failures return
`{ success:false, errors: ZodIssue[] }` with `400`.

### 5.1 `POST /api/auth/register`
- **Auth**: none
- **Body**: `{ name, email, phoneNumber, password }`
- **Logic**: validate (`registerApiSchema`) → check existing user by `email` OR
  `phoneNumber` → `409` if either exists → `bcrypt.hash(password, 10)` → create `User`
  → `generateToken({ id, name, email })` → set `token` cookie (`httpOnly`, `secure` in
  prod, `maxAge=3600`, `path=/`).
- **Success 201**: `{ success:true, message:"Registration successful", user:{ id, name, email } }`
- **Errors**: `400` (validation), `409` (email/phone exists), `500`.

### 5.2 `POST /api/auth/login`
- **Auth**: none
- **Body**: `{ email, password }`
- **Logic**: validate (`loginSchema`) → find user by email → `404` if not found →
  `bcrypt.compare` → `401` if mismatch → issue JWT cookie (same shape as register).
- **Success 200**: `{ success:true, message:"Login Successful" }`
- **Errors**: `400`, `404` (user not found), `401` (bad password), `500`.

### 5.3 `POST /api/auth/logout`
- **Auth**: implicitly required (has a cookie to clear), no explicit check performed
- **Logic**: `cookieStore.delete("token")`.
- **Success 200**: `{ success:true, message:"Logged out successfully" }`

### 5.4 `POST /api/recharge`
- **Auth**: required (`auth()`) → `401` if not authenticated
- **Body**: `{ mobileNumber, operator, amount }`
- **Logic**:
  1. Validate with `rechargeSchema` → `400` on failure.
  2. `auth()` → `401` if no session.
  3. Duplicate check: existing `Recharge` for same `userId` + `mobileNumber` +
     `operator` + `amount` with `createdAt >= now - 10s` → `409` if found.
  4. `transactionId = "TXN" + Date.now() + random(0-9999)`.
  5. `razorpay.orders.create({ amount: round(amount*100), currency:"INR", receipt: transactionId })`.
  6. `prisma.recharge.create({ userId, mobileNumber, operator, amount, transactionId, razorpayOrderId })` (status defaults to `PENDING`).
- **Success 201**: `{ success:true, message:"Recharge initiated successfully.", recharge, razorpayOrder:{ id, amount, currency } }`
- **Errors**: `400`, `401`, `409` (duplicate), `500`.

### 5.5 `GET /api/recharge`
- **Auth**: required (`auth()`) → `401` if not authenticated
- **Query params**: `operator?`, `date?` (ISO date, filters `createdAt` to that day),
  `page?` (default 1), `limit?` (default 10)
- **Logic**: builds a Prisma `where` from `userId` (+ optional `operator`/`date` range)
  → paginated `findMany` (ordered `createdAt desc`) → `count` for `total`/`totalPages`
  → `hasPending` flag (any `PENDING` recharge for the user) → `groupBy(status)` to
  compute `statistics { total, successful, pending, failed }`.
- **Success 200**:
```json
{
  "success": true,
  "recharges": [ { "id": "...", "mobileNumber": "...", "operator": "JIO", "amount": 299,
                    "status": "PENDING", "transactionId": "TXN...",
                    "razorpayOrderId": "...", "razorpayPaymentId": null,
                    "createdAt": "...", "updatedAt": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 },
  "statistics": { "total": 5, "successful": 2, "pending": 1, "failed": 2 },
  "hasPending": true
}
```
- **Errors**: `400` (invalid `date`), `401`, `500`.

### 5.6 `POST /api/payment/verify`
- **Auth**: none enforced explicitly (relies on Razorpay signature as the trust boundary)
- **Body**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- **Logic**: `HMAC_SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)` compared to
  `razorpay_signature` → `400` on mismatch → find `Recharge` by `razorpayOrderId` →
  `404` if missing → update `status = SUCCESS`, set `razorpayPaymentId`.
- **Success 200**: `{ success:true, message:"Payment verified successfully", recharge }`
- **Errors**: `400` (bad signature), `404` (no matching recharge), `500`.

### 5.7 `POST /api/payment/failed`
- **Auth**: none enforced explicitly
- **Body**: `{ razorpay_order_id }`
- **Logic**: find `Recharge` by `razorpayOrderId` → `404` if missing → update
  `status = FAILED`.
- **Success 200**: `{ success:true, message:"Payment marked as failed", recharge }`
- **Errors**: `404`, `500`.

---

## 6. Frontend Component Design

### `app/dashboard/page.jsx` (Server Component)
Reads the session (server-side), passes the resolved `user` into `Dashboard`
(client component). Effectively a second, page-level auth check in addition to
`proxy.js` middleware.

### `app/dashboard/Dashboard.jsx` (Client Component)
State:
```js
filters:        { operator: "", date: "" }   // controlled inputs
appliedFilters:  { operator: "", date: "" }   // committed filters sent to the API
refreshKey:      number                        // bumped to force RechargeHistory refetch
```
Composition: `Navbar` → `WelcomeSection(user)` → `RechargeForm(onSuccess)` →
`FilterBar(filters, setFilters, onApply, onReset)` → `SummaryCards` +
`RechargeHistory(appliedFilters, refreshKey)`.

### `components/RechargeForm.jsx`
- Local state: `formData { mobileNumber, operator, amount }`, `loading`, `errors`.
- `loadRazorpay()`: dynamically injects `checkout.razorpay.com/v1/checkout.js` into
  the DOM, resolves `true`/`false` on load/error.
- `handleSubmit`:
  1. Client-side `rechargeSchema.safeParse` → sets field-level `errors` on failure.
  2. `createRecharge(formData)` → `POST /api/recharge`.
  3. On success, loads Razorpay script and opens `new window.Razorpay({...}).open()`
     using the returned `razorpayOrder`.
  4. On Razorpay `handler` callback → `POST /api/payment/verify`.
  5. On Razorpay checkout dismiss/failure → `POST /api/payment/failed`.
  6. Calls `onSuccess()` (bumps `refreshKey` in `Dashboard`) to trigger a history
     refresh and starts/relies on polling for status updates.

### `components/RechargeHistory.jsx`
- Fetches `getRecharges(appliedFilters, page)` (services/recharge.js →
  `GET /api/recharge`).
- Polls on an interval (e.g. `setInterval`/`useEffect`) while the API response's
  `hasPending === true`; stops polling once no pending recharges remain.
- Renders each row with `StatusBadge` (color-coded PENDING/SUCCESS/FAILED).

### `components/FilterBar.jsx`
Controlled inputs for `operator` (select) and `date` (date picker); `Apply`/`Reset`
buttons call the handlers passed down from `Dashboard`.

### `components/SummaryCards.jsx`
Renders `statistics.{total, successful, pending, failed}` returned by
`GET /api/recharge` as stat cards.

### `components/StatusBadge.jsx`
Pure presentational component mapping `status` → color/label (Pending = amber,
Success = green, Failed = red).

### `components/Navbar.jsx` / `WelcomeSection.jsx`
Navbar: branding + logout button (calls `logout()` → `POST /api/auth/logout` →
client-side redirect to `/login`).
WelcomeSection: greets `user.name`.

---

## 7. Sequence Diagrams (textual)

### 7.1 Register → Login → Access Dashboard
```
Browser          Next.js Middleware        API Route            DB
  |  GET /dashboard      |                     |                 |
  |---------------------->  proxy.js: no cookie |                 |
  |  <---- 302 /login ----|                     |                 |
  |  POST /api/auth/register (form data)        |                 |
  |----------------------------------------------> validate, hash |
  |                                              |---------------->  create User
  |                                              |<---------------- User row
  |  <---- 201 + Set-Cookie: token ---------------|                 |
  |  GET /dashboard      |                     |                 |
  |---------------------->  proxy.js: token OK  |                 |
  |                        NextResponse.next()  |                 |
  |  dashboard/page.jsx (server) -> auth() -> render Dashboard    |
```

### 7.2 Create Recharge + Razorpay Payment
```
Browser            API /api/recharge         Razorpay          DB
  | submit form  --->  validate + auth()                        |
  |                    duplicate check(10s window) ------------->|
  |                    generate transactionId                    |
  |                    orders.create() --------> order created --|
  |                    prisma.recharge.create (PENDING) -------->|
  | <--- 201 {recharge, razorpayOrder} ---|                       |
  | open Razorpay Checkout (order.id) --------------------------->|
  | user pays  <---------------------------------- payment result |
  | POST /api/payment/verify {order_id, payment_id, signature}    |
  |   verify HMAC signature                                       |
  |   update Recharge -> SUCCESS ------------------------------->|
  | <--- 200 {recharge: SUCCESS} ---|                              |
```

### 7.3 Live Status Polling
```
RechargeHistory component
  mount / refreshKey change --> GET /api/recharge?filters&page
       <-- { recharges, statistics, hasPending }
  if hasPending === true:
       setInterval(poll GET /api/recharge, N seconds)
       on each tick: if hasPending becomes false -> clearInterval
```

---

## 8. Error Handling Conventions

- Every route wraps logic in `try/catch`; unexpected errors are logged via
  `console.error` and return `500 { success:false, message:"Internal Server Error" }`.
- Validation errors always return the raw Zod `issues` array under `errors` with
  `400`, letting the client map `issue.path[0]` → field-level error message.
- Duplicate recharge and existing-user checks use `409 Conflict`.
- Auth failures use `401 Unauthorized`; not-found lookups use `404`.

---

## 9. Security Notes / Known Gaps (as implemented)

- `proxy.js` middleware re-implements JWT verification instead of reusing
  `lib/jwt.js#verifyToken` — logic duplication risk if the secret/algorithm changes.
- `POST /api/auth/logout`, `POST /api/payment/verify`, and `POST /api/payment/failed`
  do not explicitly call `auth()`/authorize the caller — logout only clears a cookie
  (low risk), but the payment endpoints trust the Razorpay signature as the sole proof
  of authenticity rather than also checking the recharge belongs to the requesting
  user's session.
- JWT cookie has a fixed 1-hour expiry with no refresh-token mechanism, so sessions
  expire silently after an hour.
- `crypto` is listed as an explicit npm dependency even though it's a Node.js built-in
  module (used only in `payment/verify/route.js` for HMAC signing).

---

## 10. Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `DATABASE_URL` | `lib/prisma.js` | PostgreSQL connection string |
| `JWT_SECRET` | `lib/jwt.js`, `proxy.js` | Sign/verify JWT session tokens |
| `RAZORPAY_KEY_ID` | `lib/razorpay.js` | Razorpay SDK / Checkout public key |
| `RAZORPAY_KEY_SECRET` | `lib/razorpay.js`, `api/payment/verify` | Razorpay SDK secret + HMAC signature verification |
