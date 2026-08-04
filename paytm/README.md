# 📱 Recharge System

A full-stack Recharge System built with **Next.js**, **React**, **Prisma ORM**, and **PostgreSQL**. The application allows users to securely register, log in, simulate performing mobile recharges, and view their recharge history through a modern dashboard.They can filter recharges using operator or date.No duplicate recharges are allowed within 10 seconds to prevent double submission.Recharge history updates automatically as polling is implemented to fetch data every 5 seconds.

---

## 📖 Project Overview

The **Recharge System** is a modern full-stack web application that simulates a real-world mobile recharge platform while following industry-standard software development practices. It provides a secure and seamless workflow where users can create an account, authenticate using JWT-based authentication, perform simulated mobile recharges through Razorpay Test Mode, and monitor their transaction history from a centralized dashboard.

The application is built using **Next.js** for both the frontend and backend API routes, **Prisma ORM** for database interactions, and **PostgreSQL** for reliable data persistence. It follows a modular architecture with clearly separated API routes, services, validation logic, and database models, making the project scalable and easy to maintain.

To enhance reliability and user experience, the system includes features such as secure HTTP-only cookie authentication, input validation, duplicate recharge prevention, automatic transaction status updates through polling, recharge history filtering, responsive UI, and dark mode support. Together, these features demonstrate practical implementation of authentication, database management, API development, payment gateway integration, state management, and modern web application architecture.

---

# 🚀 Getting Started

## 👤 For Users

### How to Use the Application

1. Register a new account.
2. Log in using your credentials.
3. Enter a mobile number.
4. Select an operator.
5. Enter the recharge amount.
6. Complete the Razorpay test payment.
7. View recharge history.
8. Logout securely.

---

## 👨‍💻 For Developers

### Prerequisites

- Node.js
- PostgreSQL
- npm

## ⚙️ Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Navigate to the Project

```bash
cd paytm
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file.

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```
---

### Run Database Migrations

npx prisma migrate deploy

### Generate Prisma Client

npx prisma generate
---
# Credentials of Card Numbers to Use in Razor Pay
LINK-https://razorpay.com/docs/payments/payments/test-card-details/?preferred-country=IN

CARD -4100 2800 0000 1007
CARD -5555 5100 0008 1006
CARD -5180 2872 0009 1001

---

## ▶️ Run the Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

## 🚀 Features

- 🔐 User Registration
- 🔑 User Login
- 🍪 JWT Authentication using HTTP-only Cookies
- 📱 Mobile Recharge
- 📊 Dashboard
- 📜 Recharge History
- 🔍 Filter Recharge History
- 🚫 Duplicate Recharge Prevention
- 📈 Transaction Status Tracking(polling)
- 🚪 Secure Logout
- 📱 Responsive Design
- Razorpay Integration
- Dark Mode

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React.js
- Tailwind CSS

### Backend

- Next.js API Routes
- JWT Authentication

### Database

- PostgreSQL
- Prisma ORM

### Development Tools

- Git & GitHub
- VS Code
- Postman

---

## 📂 Project Structure

paytm/
│
├── docs/
│   ├── PRD.md
│   ├── API.md
│   ├── backendArchitecture.md
│   └── frontendArchitecture.md
│
├── prisma/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── recharge/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   └── page.jsx
│   │
│   ├── components/
│   └── globals.css
│
├── package.json
└── README.md

---

## 🏗️ System Architecture

Flowchart LR
    User --> Frontend
    Frontend --> API
    API --> Authentication
    API --> RechargeService
    RechargeService --> Prisma
    Prisma --> PostgreSQL

---

## 🔄 Application Workflow


Flowchart TD
    Register --> dashboard
    Login --> Dashboard
    Dashboard --> Recharge
    Recharge --> Database
    Database --> RechargeHistory
    RechargeHistory --> Dashboard
    Dashboard --> Logout


---

## 🔐 Authentication Flow

Flowchart TD
    User --> Login
    Login --> VerifyCredentials
    VerifyCredentials --> GenerateJWT
    GenerateJWT --> StoreCookie
    StoreCookie --> ProtectedRoutes

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/recharge` | Create a recharge |
| GET | `/api/recharge` | Fetch recharge history |

---

## 📚 Documentation

Detailed project documentation is available inside the `docs` folder.

| Document | Description |
|----------|-------------|
| `PRD.md` | Product Requirements Document |
| `API.md` | API Documentation |
| `backendArchitecture.md` | Backend Architecture |
| `frontendArchitecture.md` | Frontend Architecture |

---

## 🔮 Future Enhancements

- Payment Gateway Integration
- SMS Notifications
- Email Notifications
- User Profile Management
- Admin Dashboard
- Analytics Dashboard
- Recharge Reports

---

## 👨‍💻 Author

**Madhav Sukhija**
**Payal**
**Aayaan Choudhary**

Second-Year Computer Science Students of kalvium

---

## 📄 License

This project is created for learning and educational purposes.