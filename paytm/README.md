# 📱 Recharge System

A full-stack Recharge System built with **Next.js**, **React**, **Prisma ORM**, and **PostgreSQL**. The application allows users to securely register, log in, perform mobile recharges, and view their recharge history through a modern dashboard.

---

## 📖 Project Overview

The Recharge System is designed to simplify the mobile recharge experience while demonstrating modern full-stack web development practices. It includes secure authentication, recharge transaction management, history tracking, and a responsive user interface.

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
- 📈 Transaction Status Tracking
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
    Register --> Login
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
```

---
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

## 📸 Screenshots

You can add screenshots of:

- Landing Page
- Login Page
- Register Page
- Dashboard
- Recharge Form
- Recharge History

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

Aayaan Choudhary,
Madhav Sukhija,
Payal

Second-Year Computer Science Student's

---

## 📄 License

This project is created for learning and educational purposes.