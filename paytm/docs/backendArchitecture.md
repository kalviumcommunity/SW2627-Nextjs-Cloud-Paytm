# Recharge System API Documentation

Version: 1.0

---

# Base URL

Development

http://localhost:3000/api

---

# Authentication

The application uses JWT Authentication stored inside an HTTP-only cookie.

Protected Routes require a valid JWT token.

Authentication Flow

Register
      ↓
Login
      ↓
JWT Cookie Created
      ↓
Access Protected Routes
      ↓
Logout
      ↓
Cookie Removed

---

# API Overview

| Method | Endpoint | Description | Authentication |
|----------|------------------------|-----------------------------|---------------|
| POST | /auth/register | Register new user | ❌ |
| POST | /auth/login | Login user | ❌ |
| POST | /auth/logout | Logout user | ✅ |
| POST | /recharge | Create Recharge | ✅ |
| GET | /recharge | Get Recharge History | ✅ |


---

# 1. Register User

Endpoint

POST /api/auth/register

Description

Creates a new user account.

Request Body

```json
{
  "name":"Madhav",
  "email":"madhav@gmail.com",
  "phone":"9876543210",
  "password":"Password@123"
}
```

Success Response

Status Code

```
201 Created
```

Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

Possible Errors

| Status | Reason |
|---------|----------------------|
|400|Missing Fields|
|409|Email Already Exists|
|409|Mobile number Already Exists|
|500|Internal Server Error|

---

# 2. Login User

Endpoint

POST /api/auth/login

Description

Authenticates the user and stores JWT inside an HTTP-only cookie.

Request

```json
{
  "email":"madhav@gmail.com",
  "password":"Password@123"
}
```

Success Response

```
200 OK
```

```json
{
  "success": true,
  "message":"Login Successful"
}
```

Cookie

```
token=<JWT_TOKEN>

HttpOnly = true

Secure = true

SameSite = Lax
```

Possible Errors

| Status | Reason |
|---------|----------------------|
|400|Invalid Credentials|
|401|Unauthorized|
|500|Server Error|

---

# 3. Logout User

Endpoint

POST /api/auth/logout

Description

Removes JWT cookie and logs out the user.

Request

No Body Required.

Success Response

```
200 OK
```

```json
{
    "success":true,
    "message":"Logged Out Successfully"
}
```

Possible Errors

| Status | Reason |
|---------|----------------|
|500|Server Error|

---

# 4. Create Recharge

Endpoint

POST /api/recharge

Description

Creates a new mobile recharge.

Authentication

Required

Headers

```
Cookie: token=<JWT>
```

Request Body

```json
{
    "mobile":"9876543210",
    "operator":"Jio",
    "amount":299
}
```

Business Rules

- Mobile number must be 10 digits.
- Amount must be greater than 0.
- Duplicate recharge is not allowed within 10 seconds.
- Status starts as PENDING.

Success Response

```
201 Created
```

```json
{
    "success":true,
    "message":"Recharge Initiated",
    "transactionId":"TXN123456"
}
```

Possible Errors

| Status | Reason |
|---------|----------------------------|
|400|Invalid Data|
|401|Unauthorized|
|409|Duplicate Recharge|
|500|Server Error|

---

# 5. Get Recharge History

Endpoint

GET /api/recharge

Description

Returns all recharge history of the logged-in user.

Authentication

Required

Success Response

```
200 OK
```

```json
[
  {
    "transactionId":"TXN101",
    "mobile":"9876543210",
    "operator":"Airtel",
    "amount":199,
    "status":"SUCCESS",
    "createdAt":"2026-07-21T12:30:00Z"
  },
  {
    "transactionId":"TXN102",
    "mobile":"9999999999",
    "operator":"Jio",
    "amount":299,
    "status":"PENDING",
    "createdAt":"2026-07-21T12:45:00Z"
  }
]
```

Possible Errors

| Status | Reason |
|---------|----------------|
|401|Unauthorized|
|500|Server Error|

---


# Status Codes Used

| Code | Meaning |
|------|---------------------------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|404|Not Found|
|409|Conflict|
|500|Internal Server Error|

---

# Authentication Middleware

Protected APIs

- POST /api/auth/logout
- POST /api/recharge
- GET /api/recharge

Flow

Client

↓

JWT Cookie

↓

Auth Middleware

↓

Verify Token

↓

User Authorized

↓

API Executes

---

# Recharge Lifecycle

User Creates Recharge

↓

Status = PENDING

↓

Background Processing

↓

SUCCESS / FAILED

↓

Dashboard Updates Automatically

---

# Error Response Format

```json
{
    "success":false,
    "message":"Error Description"
}
```

---

# Success Response Format

```json
{
    "success":true,
    "message":"Operation Successful",
    "data":{}
}
```

---

# Future APIs

- PUT /api/profile
- GET /api/profile
- DELETE /api/account
- POST /api/recharge/cancel
- GET /api/dashboard/stats
- GET /recharge/:id
