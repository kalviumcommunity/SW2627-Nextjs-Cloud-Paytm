# Recharge System Frontend Architecture

# Overview

The Recharge System frontend is built using **Next.js App Router** and **React**. It provides an intuitive interface for user authentication, mobile recharge, recharge history, transaction tracking, and dashboard management.

The frontend communicates with the backend using REST APIs and uses JWT stored in HTTP-only cookies for secure authentication.

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js | React Framework |
| React | UI Development |
| Tailwind CSS | Styling |
| JavaScript | Application Logic |
| Fetch API | API Communication |
| JWT Cookies | Authentication |

---

# Frontend Folder Structure

src
│
├── app
│   ├── api
│   │   ├── auth
│   │   └── recharge
|   |   ├──payment
│   │
│   ├── dashboard
│   │   └── page.jsx
|   |   ├──Dashboard.jsx
│   │
│   ├── login
│   │   └── page.jsx
│   │
│   ├── register
│   │   └── page.jsx
│   │
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
│
├── components
│   ├── Navbar.jsx
│   ├── RechargeForm.jsx
│   ├── RechargeHistory.jsx
│   ├── FilterBar.jsx
│   ├── StatusBadge.jsx
│   └── WelcomeSection.jsx
|   ├── ThemeProvider.jsx
|   ├──ThemeToggle.jsx

---

# Frontend Architecture


Flowchart LR

A[User]

A --> B[Next.js Pages]

B --> C[React Components]

C --> D[REST API Calls]

D --> E[Backend APIs]

E --> F[(PostgreSQL Database)]


---

# Application Routing


Flowchart TD

Home["Landing Page"]

Home --> Login

Home --> Register

Login --> Dashboard

Register --> Login

Dashboard --> Recharge

Dashboard --> RechargeHistory

Dashboard --> Logout


---

# Component Hierarchy

Flowchart TD

Dashboard

Dashboard --> Navbar

Dashboard --> RechargeForm

Dashboard --> FilterBar

Dashboard --> RechargeHistory

RechargeHistory --> StatusBadge


---

# Authentication Flow

Flowchart TD

User

User --> LoginPage

LoginPage --> LoginAPI

LoginAPI --> JWTCookie

JWTCookie --> Dashboard

Dashboard --> ProtectedPages

ProtectedPages --> Logout

Logout --> CookieDeleted

---

# Recharge Workflow


Flowchart TD

User

User --> RechargeForm

RechargeForm --> InputValidation

InputValidation --> RechargeAPI

RechargeAPI --> Database

Database --> TransactionCreated

TransactionCreated --> DashboardUpdated

---

# Dashboard Workflow

Flowchart LR

Dashboard

Dashboard --> RechargeForm

Dashboard --> FilterBar

Dashboard --> RechargeHistory

RechargeHistory --> StatusBadge

---

# API Communication Flow

Flowchart TD

ReactComponent

ReactComponent --> FetchRequest

FetchRequest --> BackendAPI

BackendAPI --> Database

Database --> APIResponse

APIResponse --> ReactComponent

ReactComponent --> UpdateUI

---

# Frontend Request Lifecycle


Flowchart TD

UserAction

UserAction --> ReactComponent

ReactComponent --> APIRequest

APIRequest --> Backend

Backend --> Database

Database --> Response

Response --> ReactState

ReactState --> RenderUI

---

# State Management Flow


Flowchart LR

UserInput

UserInput --> ComponentState

ComponentState --> APIRequest

APIRequest --> APIResponse

APIResponse --> StateUpdated

StateUpdated --> UIUpdated

---

# Page Responsibilities

| Page | Responsibility |
|------|----------------|
| Landing Page | Entry point of the application |
| Login | User authentication |
| Register | User registration |
| Dashboard | Main application interface |

---

# Component Responsibilities

| Component | Responsibility |
|------------|----------------|
| Navbar | Navigation and Logout |
| RechargeForm | Create a new recharge |
| RechargeHistory | Display recharge transactions |
| FilterBar | Filter recharge history |
| StatusBadge | Show recharge status |
| SummaryCards | Display dashboard statistics |

---

# Frontend Security

- JWT Authentication
- HTTP-only Cookies
- Protected Dashboard Routes
- Client-side Input Validation
- Secure API Communication
- Pagination for Recharge History

---

# Future Enhancements

- User Profile Management
- Download Recharge Receipts
- Real-Time Status Updates using WebSockets
- Mobile Responsive Enhancements

Flowchart LR

subgraph Client["Client Layer"]
    User([User])
end

subgraph Frontend["Frontend (Next.js + React)"]
    Landing[Landing Page]
    Login[Login Page]
    Register[Register Page]
    Dashboard[Dashboard]


    Navbar[Navbar]
    Recharge[Recharge Form]
    Filter[Filter Bar]
    History[Recharge History]
    Status[Status Badge]
end

subgraph Backend["Backend"]
    API[API Routes]
    Auth[JWT Authentication]
    Prisma[Prisma ORM]
end

subgraph Database["Database"]
    DB[(PostgreSQL)]
end

User --> Landing
Landing --> Login
Landing --> Register

Login --> Dashboard

Dashboard --> Navbar
Dashboard --> Recharge
Dashboard --> Filter
Dashboard --> History

History --> Status

Recharge --> API
History --> API
Login --> API
Register --> API
Navbar --> API

API --> Auth
Auth --> Prisma
Prisma --> DB

DB --> Prisma
Prisma --> API
API --> Dashboard