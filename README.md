# Employee Management Application (EMS) - Startup & Operational Guide

Welcome to the **Employee Management System (EMS)**. This document provides a complete guide on how to install, configure, start, and test the full-stack application (Next.js Frontend + Express/MongoDB Backend).

---

## 📋 System Prerequisites

Before launching the application, ensure you have the following installed on your machine:

1. **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **npm**: Included with Node.js
3. **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas connection string.

---

## 🚀 Quick Start Guide (Step-by-Step)

### Step 1: Start MongoDB
Ensure your local MongoDB daemon is running:
* **Windows**: Start MongoDB service via Services or run `mongod` in terminal.
* **Default URI**: `mongodb://127.0.0.1:27017/ems_db`

---

### Step 2: Launch the Backend Service

Open a terminal window and execute:

```bash
# 1. Navigate to the Backend folder
cd d:\EMS\Backend

# 2. Install dependencies (if running for the first time)
npm install

# 3. Start the Express API server in development mode
npm run dev
```

#### 🌐 Backend URLs & Endpoints:
* **Server Healthcheck**: [http://localhost:5000/](http://localhost:5000/)
* **Swagger Interactive API Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
* **REST API Base URL**: `http://localhost:5000/api/v1`

---

### Step 3: Launch the Frontend Application

Open a **new separate terminal window** and execute:

```bash
# 1. Navigate to the Frontend folder
cd d:\EMS\Frontend

# 2. Install dependencies (if running for the first time)
npm install

# 3. Start the Next.js development server
npm run dev
```

#### 🌐 Frontend Workspace URL:
* **Application URL**: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test User Credentials & Demo Login

The system includes pre-seeded test accounts and **One-Click Demo Autofill** buttons on the sign-in screen:

| Role | Email | Password | Features & Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ems.com` | `password123` | Staff Directory CRUD, Add/Edit/Delete employees, Company-wide attendance monitoring, Approve/Reject leaves, Post company holidays |
| **Employee** | `alex@ems.com` | `password123` | Daily Punch Check-In/Out, Lunch & Tea break timers, Personal attendance history, View holiday calendar, Apply for leaves |

> 💡 **Role Switcher**: Click the **"Switch to Admin Portal / Employee View"** button in the top navigation bar at any time to toggle between Admin governance and Employee punch views!

---

## 🏛️ Application Architecture & Features Summary

### 1. Frontend (`EMS/Frontend`)
* **Framework**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS, Dark Mode Design Tokens, Glassmorphism panels (`glass-panel`)
* **Validation**: Zod client & server validation schemas
* **Icons & Animation**: Lucide React icons, Framer Motion
* **API Client**: Axios instance (`services/api.ts`) with automatic JWT Bearer token interceptor

### 2. Backend (`EMS/Backend`)
* **Framework**: Node.js, Express.js, TypeScript
* **Database**: MongoDB with Mongoose ODM (`User`, `Attendance`, `Break`, `Holiday`, `Leave` schemas)
* **Security**: Helmet HTTP headers, CORS, Express-Rate-Limit, JWT authentication, Bcrypt.js password hashing
* **API Documentation**: OpenAPI 3.0 via Swagger UI (`http://localhost:5000/api-docs`)

---

## 🛠️ Handy Development Commands

### Backend Commands (`d:\EMS\Backend`)
```bash
npm run dev      # Start dev server with auto-reload (ts-node-dev)
npm run build    # Compile TypeScript code to dist/
npm start        # Run compiled production build from dist/server.js
```

### Frontend Commands (`d:\EMS\Frontend`)
```bash
npm run dev      # Start Next.js dev server on port 3000
npm run build    # Create optimized Next.js production build
npm run start    # Start production Next.js server
```

---

## ❓ Troubleshooting & FAQ

1. **Port 5000 in use error (`EADDRINUSE`)**:
   - Kill any lingering Node process or change `PORT=5001` in `d:\EMS\Backend\.env`.

2. **MongoDB Connection Failed**:
   - Make sure MongoDB service is active locally or update `MONGODB_URI` in `d:\EMS\Backend\.env`.

3. **CORS Error**:
   - Ensure `CORS_ORIGIN=http://localhost:3000` is set in `d:\EMS\Backend\.env`.

---
*EMS Enterprise - Employee Management Application Guide.*
