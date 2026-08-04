# Backend Architecture

## Overview

The Recharge System follows a layered architecture where every request passes through validation, authentication, business logic, payment processing (Razorpay), database operations, and background processing before a response is returned to the client.

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js |
| Backend | Next.js API Routes |
| Authentication | JWT (HTTP-only Cookies) |
| Payment Gateway | Razorpay (Test Mode) |
| ORM | Prisma |
| Database | PostgreSQL |
| Background Processing | Background Worker / Scheduler |

---

# Complete Backend Flow

User

↓

Register

↓

User Saved in PostgreSQL

↓

Login

↓

JWT Generated

↓

JWT Stored in HTTP-only Cookie

↓

Access Protected Routes

↓

Create Recharge Request

↓

Validate Mobile Number & Amount

↓

Check Duplicate Recharge (10 seconds)

↓

Create Razorpay Order

↓

Return Order Details

↓

Open Razorpay Checkout

↓

User Completes Payment

↓

Verify Razorpay Signature

↓

Create Recharge Record

↓

Status = PENDING

↓

Save Recharge in PostgreSQL

↓

Background Worker Processes Recharge

↓

SUCCESS / FAILED

↓

Recharge History Updated

↓

Response Sent to Client

↓

Logout

↓

JWT Cookie Removed

---

# Backend Request Flow

+---------+
| Client  |
+---------+
     |
     | HTTP Request
     v
+----------------------+
| Next.js API Routes   |
+----------------------+
     |
     | Validate Request
     v
+----------------------+
| Authentication (JWT) |
+----------------------+
     |
     | Authorized
     v
+----------------------+
| Business Logic       |
+----------------------+
     |
     +-----------------------------------------+
     |                                         |
     | Authentication APIs                     |
     | Register / Login / Logout               |
     |                                         |
     +-----------------------------------------+
     |
     +-----------------------------------------+
     | Recharge APIs                           |
     |                                         |
     v
+----------------------+
| Payment Service      |
+----------------------+
     |
     | Create Razorpay Order
     v
+----------------------+
| Razorpay Test API    |
+----------------------+
     |
     | Payment Completed
     v
+----------------------+
| Verify Signature     |
+----------------------+
     |
     | Payment Verified
     v
+----------------------+
| Recharge Service     |
+----------------------+
     |
     | Create Transaction
     v
+----------------------+
| Prisma ORM           |
+----------------------+
     |
     | SQL Queries
     v
+----------------------+
| PostgreSQL Database  |
+----------------------+
     |
     | Recharge Stored
     v
+----------------------+
| Background Worker    |
+----------------------+
     |
     | Update Status
     v
+----------------------+
| SUCCESS / FAILED     |
+----------------------+
     |
     | API Response
     v
+---------+
| Client  |
+---------+

---
---
# Credentials of Card Numbers to Use in Razor Pay
LINK-https://razorpay.com/docs/payments/payments/test-card-details/?preferred-country=IN

CARD -4100 2800 0000 1007
CARD -5555 5100 0008 1006
CARD -5180 2872 0009 1001

---

# Layer Responsibilities

## 1. Client

- Sends API requests.
- Displays recharge history and payment status.
- Opens Razorpay Checkout for payment.

---

## 2. Next.js API Routes

Responsible for receiving HTTP requests and routing them to the appropriate service.

Example Routes:

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- POST `/api/payment/failed`
- POST `/api/payment/verify`
- POST `/api/recharge`
- GET `/api/recharge`

---

## 3. Validation Layer

Validates incoming request data before executing business logic.

Examples:

- Required fields
- Valid email format
- Mobile number length
- Password rules
- Recharge amount greater than zero

---

## 4. Authentication Layer

Uses JWT stored inside an HTTP-only cookie.

Responsibilities:

- Verify JWT
- Extract authenticated user
- Protect private APIs
- Reject unauthorized requests

Protected Routes:

- Logout
- Create Razorpay Order
- Verify Payment
- Create Recharge
- Get Recharge History

---

## 5. Business Logic Layer

Handles application rules.

Authentication

- Register users
- Login users
- Logout users

Recharge

- Validate recharge request
- Prevent duplicate recharge within 10 seconds
- Generate transaction ID
- Create recharge record

Payment

- Create Razorpay Order
- Verify Razorpay Payment Signature
- Allow recharge creation only after successful payment

---

## 6. Razorpay Integration

The application uses **Razorpay Test Mode**.

Responsibilities:

- Create payment order
- Collect payment
- Return payment details
- Verify payment signature

Payment Flow

Create Order

↓

Open Checkout

↓

Complete Payment

↓

Verify Signature

↓

Payment Verified

---

## 7. Prisma ORM

Acts as the bridge between the backend and PostgreSQL.

Responsibilities:

- Create users
- Read recharge history
- Insert recharge transactions
- Update recharge status

---

## 8. PostgreSQL Database

Stores all persistent application data.

Tables include:

- Users
- Recharge Transactions

---

## 9. Background Worker

Runs independently of the client request.

Responsibilities:

- Process pending recharges
- Simulate operator processing
- Update recharge status
- Notify dashboard with latest status

Lifecycle

PENDING

↓

Processing

↓

SUCCESS / FAILED

---

# Authentication Flow

Register

↓

Login

↓

JWT Created

↓

JWT Stored in Cookie

↓

Protected API Request

↓

JWT Verification

↓

Authorized

↓

API Executes

↓

Logout

↓

Cookie Removed

---

# Recharge & Payment Flow

User Selects Recharge

↓

Create Recharge Request

↓

Validate Request

↓

Create Razorpay Order

↓

Razorpay Checkout Opens

↓

User Pays

↓

Verify Razorpay Signature

↓

Create Recharge Transaction

↓

Status = PENDING

↓

Background Processing

↓

SUCCESS / FAILED

↓

Dashboard Updates Automatically

---

# Advantages of This Architecture

- Layered and modular design
- Secure JWT authentication
- Secure payment handling with Razorpay
- Database abstraction using Prisma
- Easy to maintain and extend
- Background processing for recharge updates
- Scalable architecture suitable for future enhancements
- Clear separation of concerns, making debugging and testing easier.
- API routes, services, and database layers can be developed independently by different team members.
- Consistent request validation and centralized authentication improve application reliability and security.
- Designed to support future features such as multiple payment gateways, additional recharge operators, notifications, and analytics with minimal architectural changes.