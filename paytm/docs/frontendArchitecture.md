# Recharge System Frontend Architecture

Version: 1.0

---

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

```text
src
│
├── app
│   ├── api
│   │   ├── auth
│   │   └── recharge
│   │
│   ├── dashboard
│   │   └── page.jsx
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
│   └── SummaryCards.jsx
```

---

# Frontend Architecture

```mermaid
flowchart LR

A[User]

A --> B[Next.js Pages]

B --> C[React Components]

C --> D[REST API Calls]

D --> E[Backend APIs]

E --> F[(PostgreSQL Database)]
```

---

# Application Routing

```mermaid
flowchart TD

Home["Landing Page"]

Home --> Login

Home --> Register

Login --> Dashboard

Register --> Login

Dashboard --> Recharge

Dashboard --> RechargeHistory

Dashboard --> Logout
```

---

# Component Hierarchy

```mermaid
flowchart TD

Dashboard

Dashboard --> Navbar

Dashboard --> SummaryCards

Dashboard --> RechargeForm

Dashboard --> FilterBar

Dashboard --> RechargeHistory

RechargeHistory --> StatusBadge
```

---

# Authentication Flow

```mermaid
flowchart TD

User

User --> LoginPage

LoginPage --> LoginAPI

LoginAPI --> JWTCookie

JWTCookie --> Dashboard

Dashboard --> ProtectedPages

ProtectedPages --> Logout

Logout --> CookieDeleted
```

---

# Recharge Workflow

```mermaid
flowchart TD

User

User --> RechargeForm

RechargeForm --> InputValidation

InputValidation --> RechargeAPI

RechargeAPI --> Database

Database --> TransactionCreated

TransactionCreated --> DashboardUpdated
```

---

# Dashboard Workflow

```mermaid
flowchart LR

Dashboard

Dashboard --> SummaryCards

Dashboard --> RechargeForm

Dashboard --> FilterBar

Dashboard --> RechargeHistory

RechargeHistory --> StatusBadge
```

---

# API Communication Flow

```mermaid
flowchart TD

ReactComponent

ReactComponent --> FetchRequest

FetchRequest --> BackendAPI

BackendAPI --> Database

Database --> APIResponse

APIResponse --> ReactComponent

ReactComponent --> UpdateUI
```

---

# Frontend Request Lifecycle

```mermaid
flowchart TD

UserAction

UserAction --> ReactComponent

ReactComponent --> APIRequest

APIRequest --> Backend

Backend --> Database

Database --> Response

Response --> ReactState

ReactState --> RenderUI
```

---

# State Management Flow

```mermaid
flowchart LR

UserInput

UserInput --> ComponentState

ComponentState --> APIRequest

APIRequest --> APIResponse

APIResponse --> StateUpdated

StateUpdated --> UIUpdated
```

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

---

# Future Enhancements

- Dark Mode
- User Profile Management
- Download Recharge Receipts
- Real-Time Status Updates using WebSockets
- Pagination for Recharge History
- Mobile Responsive Enhancements




```mermaid
flowchart LR

subgraph Client["Client Layer"]
    User([User])
end

subgraph Frontend["Frontend (Next.js + React)"]
    Landing[Landing Page]
    Login[Login Page]
    Register[Register Page]
    Dashboard[Dashboard]

    Navbar[Navbar]
    Summary[Summary Cards]
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
Dashboard --> Summary
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
```