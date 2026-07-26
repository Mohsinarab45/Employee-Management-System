# Employee Management System (EMS) - Master Project Plan & Architecture Document

---

## 1. Project Overview & Technology Stack

The **Employee Management System (EMS)** is a modern, enterprise-grade web application designed to streamline employee data management, attendance tracking, break management, holiday calendars, and administrative governance. It features distinct role-based portals for **Administrators** and **Employees**, secured by robust authentication and clean UI/UX paradigms.

### Tech Stack Specification

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router v14+) | Server & Client component rendering, routing, layout engine |
| **Frontend Language** | TypeScript | Type safety and reliable code structure |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Modern, responsive, aesthetic UI design system |
| **Validation** | Zod | Client-side and server-side schema verification |
| **Backend Framework** | Node.js + Express.js | High-performance REST API services |
| **Backend Language** | TypeScript / JavaScript (ES6+) | Backend logic execution |
| **Security & Middleware** | Helmet, CORS, Express-Rate-Limit, JsonWebToken, Bcrypt.js | API protection, HTTP header security, JWT auth, password hashing |
| **Database** | MongoDB + Mongoose ODM | NoSQL document database for flexible schema management |

---

## 2. Directory & Module Architecture

The system is structured as a decoupled monorepo/dual-folder architecture within `EMS/`.

```
EMS/
├── Backend/
│   ├── config/             # DB & Environment setup
│   ├── controllers/        # Request handlers (Auth, Admin, Attendance, Holidays, Leaves)
│   ├── middleware/         # Auth JWT verification, RBAC guards, error handler, rate limiters
│   ├── models/             # Mongoose schemas (User, Attendance, Break, Holiday, Leave)
│   ├── routes/             # Express routing modules
│   ├── utils/              # Token generators, password hashers, date formatters
│   ├── validators/         # Zod API request schemas
│   ├── server.ts           # Express application entrance
│   └── package.json
├── Frontend/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth routes (login, forgot-password, reset-password)
│   │   ├── (dashboard)/    # Shared dashboard layout engine
│   │   │   ├── admin/      # Admin pages (employee CRUD, attendance logs, holiday manager)
│   │   │   └── employee/   # Employee pages (daily check-in/out, break tracker, calendar view)
│   │   ├── api/            # Local API proxy handlers (if required)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Buttons, Cards, Modals, Inputs, Badges, Tables
│   │   ├── admin/          # Admin specific widgets & data tables
│   │   ├── employee/       # Digital clock, punch-in card, break counter
│   │   └── shared/         # Sidebar, Navbar, Notifications, User Menu
│   ├── context/            # AuthContext, ThemeContext, AttendanceContext
│   ├── hooks/              # Custom React hooks (useAuth, useAttendance, useTimer)
│   ├── lib/                # Axios API instance, date utilities
│   ├── services/           # API integration functions
│   ├── types/              # TypeScript interface definitions
│   └── package.json
└── project_plan.md         # Master Architecture & Implementation Plan
```

---

## 3. Comprehensive Feature Modules & Functional Specifications

### Module 1: Authentication & Authorization Guard
* **User Roles**: `ADMIN`, `EMPLOYEE`
* **Features**:
  - **Admin & Employee Login**: Email & Password authentication with JWT access tokens.
  - **Session Management**: Secure client-side token management / Authorization Bearer headers.
  - **Forgot & Reset Password Flow**: Token-based password recovery mechanism via email link.
  - **Role-Based Access Control (RBAC)**: Protected route middleware blocking unauthorized access (e.g., preventing Employees from accessing `/admin/*`).

### Module 2: Employee Management Module (Admin Portal)
* **Features**:
  - **Employee Creation**: Admin can register new employees with auto-generated/assigned initial credentials, designation, department, joining date, and role.
  - **Employee Directory**: Paginated data table with search by name/email and filter by department or employment status (Active/Inactive).
  - **Profile Management**: View comprehensive details including contact info, role, joining date, attendance stats.
  - **Edit Employee**: Update profile info, designation, salary grade, department, status.
  - **Delete/Deactivate Employee**: Soft-delete/deactivate accounts to retain historical attendance records.

### Module 3: Attendance & Time Tracking Engine (Employee & Admin)
* **Employee Actions**:
  - **Check-In**: Instant punch-in button capturing start time, date, and IP address/location.
  - **Work Break Management**: Options to start and end "Lunch Break" or "Short Break". Live timer showing break duration.
  - **Check-Out**: End-of-day punch-out. Automatically computes `totalWorkMinutes` and `totalBreakMinutes`.
  - **Real-Time Clock & Status Widget**: Live digital clock displaying current working state (`NOT_CHECKED_IN`, `WORKING`, `ON_LUNCH_BREAK`, `ON_SHORT_BREAK`, `CHECKED_OUT`).
* **Admin Capabilities**:
  - View daily company-wide attendance summary (Present, Absent, Late, On Break).
  - Inspect individual employee monthly/weekly attendance logs.
  - Manual attendance adjustment/override for missing punch-outs.

### Module 4: Calendar & Holiday Management Module
* **Features**:
  - **Interactive Holiday Calendar**: Visual month/year calendar displaying upcoming official company holidays and national days.
  - **Admin Holiday CRUD**: Admin can add new holiday events, edit descriptions, or remove holidays.
  - **Employee Calendar View**: Quick access to holiday schedule to plan leave requests.

### Module 5: Leave Management Module (Essential Extension)
* **Features**:
  - **Apply for Leave**: Employees can submit leave requests specifying Leave Type (Casual, Sick, Earned), Start/End Dates, and Reason.
  - **Leave Status Tracking**: View status of requested leaves (`PENDING`, `APPROVED`, `REJECTED`).
  - **Admin Approval Queue**: Admin dashboard tab to review, approve, or reject leave applications with optional comments.

---

## 4. Database Schema & Data Models (MongoDB + Mongoose)

### 1. User Model (`users`)
```typescript
{
  _id: ObjectId,
  employeeId: { type: String, required: true, unique: true }, // e.g. "EMP-1001"
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'EMPLOYEE'], default: 'EMPLOYEE' },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Attendance Model (`attendances`)
```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD for indexing
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date, default: null },
  totalWorkMinutes: { type: Number, default: 0 },
  totalBreakMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT'], default: 'PRESENT' },
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Break Model (`breaks`)
```typescript
{
  _id: ObjectId,
  attendanceId: { type: ObjectId, ref: 'Attendance', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  breakType: { type: String, enum: ['LUNCH', 'TEA_BREAK', 'GENERAL'], default: 'LUNCH' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },
  durationMinutes: { type: Number, default: 0 },
  createdAt: Date
}
```

### 4. Holiday Model (`holidays`)
```typescript
{
  _id: ObjectId,
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  type: { type: String, enum: ['NATIONAL', 'COMPANY', 'OPTIONAL'], default: 'NATIONAL' },
  createdAt: Date
}
```

### 5. Leave Model (`leaves`)
```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['CASUAL', 'SICK', 'EARNED'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  reviewedBy: { type: ObjectId, ref: 'User' },
  adminComment: String,
  createdAt: Date
}
```

---

## 5. REST API Specifications

### Authentication Routes (`/api/v1/auth`)
- `POST /login` - User sign-in (Returns JWT Token & User Profile)
- `POST /forgot-password` - Trigger password reset token
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current logged-in user profile
- `POST /logout` - Invalidate session / clear client token

### Employee Management Routes (`/api/v1/admin/employees`) - Admin Only
- `GET /` - Fetch paginated employee list (Query params: `page`, `limit`, `search`, `department`)
- `POST /` - Create new employee
- `GET /:id` - Get employee details
- `PUT /:id` - Update employee info
- `DELETE /:id` - Deactivate/soft-delete employee

### Attendance Routes (`/api/v1/attendance`)
- `POST /check-in` - Employee check-in
- `POST /check-out` - Employee check-out
- `POST /break/start` - Start lunch/tea break
- `POST /break/end` - End break
- `GET /today` - Get today's attendance status & active breaks for logged-in user
- `GET /my-history` - Get monthly attendance log for logged-in employee
- `GET /admin/all` - (Admin Only) View company-wide attendance logs for any date range

### Holiday Routes (`/api/v1/holidays`)
- `GET /` - List all company holidays
- `POST /admin` - (Admin Only) Create holiday
- `DELETE /admin/:id` - (Admin Only) Delete holiday

### Leave Routes (`/api/v1/leaves`)
- `POST /` - Submit leave request
- `GET /my-leaves` - View personal leave history
- `GET /admin/all` - (Admin Only) View all pending/processed leave applications
- `PATCH /admin/:id/status` - (Admin Only) Approve or Reject leave request

---

## 6. UI/UX Design System & Layout Specifications

### Theme Palette & Typography
- **Primary Color**: Indigo / Violet (`#4F46E5` / `#6366F1`)
- **Secondary Color**: Slate Dark & Emerald Accent (`#0F172A`, `#10B981`)
- **Background**: Modern dark mode default (`#0B0F19`) with sleek card surfaces (`#1E293B`)
- **Typography**: Inter / Outfit via Google Fonts

### Dashboard Screens Breakdown

1. **Admin Portal**:
   - **Header**: Search bar, Notification Bell, Admin Profile Dropdown, System Clock.
   - **Metrics Bar**: 4 Stats Cards (Total Staff, Present Today, On Break, Pending Leaves).
   - **Main Content**:
     - *Tab 1*: Employee Directory (Searchable table, "Add Employee" modal trigger, Action buttons).
     - *Tab 2*: Attendance Overview (Real-time grid showing status badges for each staff member).
     - *Tab 3*: Holiday Manager (Calendar visual + Add holiday form).
     - *Tab 4*: Leave Requests Approval Queue.

2. **Employee Portal**:
   - **Action Hero Section**:
     - Live Digital Clock & Today's Date.
     - Dynamic Attendance Card: Large "Check-In" button (or "Start Lunch Break", "End Break", "Check-Out" depending on active status).
     - Live Elapsed Time Counter (showing active work time and accumulated break time).
   - **Stats Grid**:
     - Weekly Attendance Graph (Hours worked vs target).
     - Remaining Paid/Sick Leave Balances.
   - **Interactive Calendar Widget**:
     - Displaying upcoming company holidays and approved leaves.

---

## 7. Step-by-Step Stepwise Implementation Roadmap

```
Step 1: Workspace & Environment Setup (Backend & Frontend boilerplate setup)
Step 2: Backend Foundation (Express, MongoDB Connection, Security Middlewares)
Step 3: Database Models & Schemas (User, Attendance, Break, Holiday, Leave)
Step 4: Authentication Controller & RBAC Middlewares (JWT, Password hashing)
Step 5: Admin Employee CRUD API Implementation
Step 6: Attendance & Break Engine API Logic
Step 7: Holiday & Leave Management APIs
Step 8: Next.js Frontend Framework Initialization (Tailwind CSS, Icons, Fonts)
Step 9: Frontend Auth Pages & Auth Context (Login, Password Reset UI)
Step 10: Shared Components & Layout (Sidebar, Navbar, Protected Routes)
Step 11: Employee Dashboard UI (Live Punch-in card, Break timer, Daily logs)
Step 12: Admin Dashboard UI (Employee Table, Modals, Company Attendance Grid)
Step 13: Holiday Calendar & Leave Request Views
Step 14: System Integration, Validation & End-to-End Testing
```

---

## 8. Application User Guide & Operational Manual

### 🛠️ Prerequisites & Installation
1. **Node.js**: Ensure Node.js (v18+) is installed.
2. **MongoDB**: Ensure MongoDB service is running on `mongodb://127.0.0.1:27017/ems_db` (or update `.env` URI).

---

### 🚀 Step 1: How to Launch the Backend Service
```bash
# Navigate to Backend folder
cd d:\EMS\Backend

# Install dependencies (if first time)
npm install

# Start Express REST API Server in development mode
npm run dev
```
* **Server Healthcheck**: `http://localhost:5000/`
* **Swagger OpenAPI Documentation**: `http://localhost:5000/api-docs`

---

### 💻 Step 2: How to Launch the Frontend Application
```bash
# Open a new terminal and navigate to Frontend folder
cd d:\EMS\Frontend

# Install dependencies (if first time)
npm install

# Start Next.js Development Server
npm run dev
```
* **Application Workspace**: `http://localhost:3000`

---

### 🔑 Step 3: Default User Credentials & Role Access

| Portal Role | Email | Password | Features & Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ems.com` | `password123` | Staff directory management, Add/Edit/Delete employees, Company-wide attendance monitor, Approve/Reject leaves, Post holidays |
| **Employee** | `alex@ems.com` | `password123` | Daily punch Check-In/Out, Lunch & Tea break timers, Personal attendance log, View holiday calendar, Apply for leaves |

> 💡 **Quick Role Switcher**: Click the **"Switch to Admin Portal / Employee View"** pill in the top header or use **One-Click Demo Autofill** on the sign-in page for instant testing!

---

### 📖 Step 4: Feature-by-Feature Operational Instructions

#### 1. Signing In & Password Recovery
- Go to `http://localhost:3000/login`.
- Select your role tab (**Employee Login** or **Admin Portal**).
- Click **"Demo Employee"** or **"Demo Admin"** to pre-fill test credentials and click **Sign In**.
- If you forget your password, click **Forgot password?** to request a reset link.

#### 2. Employee Attendance & Time Punch Engine (`/employee/dashboard`)
- **Punch Check-In**: Click **Punch Check-In Now** upon starting your shift. The live timer immediately tracks your active working seconds.
- **Taking a Break**: Click **Take Lunch Break** or **Short Tea Break**. The working clock pauses and the break timer accumulates.
- **Ending a Break**: Click **Resume Work (End Break)** to resume your active work shift.
- **Punch Check-Out**: Click **Punch Check-Out** at shift completion. Your total work hours and break minutes are calculated and logged.

#### 3. Employee Leave Application (`/employee/leaves`)
- Click **Apply For Leave** button.
- Choose leave type (*Casual, Sick, Earned, Unpaid*), select Start & End dates, enter reason, and click **Submit Application**.
- Track your request status in real-time (*PENDING, APPROVED, REJECTED*).

#### 4. Admin Staff Directory Management (`/admin/employees`)
- View all registered staff members with live status badges.
- Use the **Search bar** (by name, email, or code) or **Department Filter**.
- Click **Add New Employee** to open the registration modal form. Fill in details and click **Create Employee**.
- Click the **Trash icon** to deactivate an account.

#### 5. Admin Leave Approvals (`/admin/leaves`)
- Navigate to **Leave Requests Queue**.
- Review pending leave applications with total day count and reasons.
- Click **Approve** or **Reject** to update status and send instant feedback to the employee.

#### 6. Admin Holiday Management (`/admin/holidays`)
- Click **Add Holiday Event**.
- Enter title, date, holiday type (*National, Company, Optional*), and click **Publish Holiday**.
- The new holiday will immediately reflect on all employee holiday calendars!

---
*Created automatically for EMS Workspace.*

