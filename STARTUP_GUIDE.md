# Employee Management System (EMS) - Complete Startup & Developer Guide

This guide provides step-by-step instructions to set up, seed, run, and test both the **Backend REST API** and **Frontend Web Application** locally or in production.

---

## 📋 System Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: `v18.0.0` or higher (Recommended `v20.x`)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Connection URI.

---

## 🛠️ Step 1: Environment Configuration

### 1. Backend Environment (`Backend/.env`)
Create a `.env` file inside the `Backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ems
JWT_SECRET=ems_jwt_super_secret_key_2026
```

### 2. Frontend Environment (`Frontend/.env.local`)
Create a `.env.local` file inside the `Frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 💾 Step 2: Database Initialization & Seeding

Populate initial demo users, attendance records, leaves, and company holidays:

```bash
cd Backend
npm run seed
```

> **Seeded Default Accounts:**
> - **Admin Portal:** `admin@ems.com` | Password: `password123`
> - **Employee Portal:** `alex@ems.com` | Password: `password123`
> - **Employee Portal:** `elena@ems.com` | Password: `password123`

---

## 🚀 Step 3: Launching the Application

### Option A: Run Backend Server
In Terminal 1:
```bash
cd Backend
npm run dev
```
- **REST API Server**: [http://localhost:5000/api](http://localhost:5000/api)
- **Swagger API Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Option B: Run Frontend Application
In Terminal 2:
```bash
cd Frontend
npm run dev
```
- **Web Portal Application**: [http://localhost:3000](http://localhost:3000)

---

## 🧭 Key Portal Routes

### Public Auth Routes
- **Sign In Portal**: [http://localhost:3000/login](http://localhost:3000/login)
- **Register Account**: [http://localhost:3000/register](http://localhost:3000/register)
- **Forgot Password**: [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password)

### Protected Admin Routes (`ADMIN` Role)
- **Admin Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Employee Directory**: [http://localhost:3000/admin/employees](http://localhost:3000/admin/employees)
- **Attendance Monitor**: [http://localhost:3000/admin/attendance](http://localhost:3000/admin/attendance)
- **Leave Requests Queue**: [http://localhost:3000/admin/leaves](http://localhost:3000/admin/leaves)
- **Company Holidays**: [http://localhost:3000/admin/holidays](http://localhost:3000/admin/holidays)

### Protected Employee Routes (`EMPLOYEE` Role)
- **Time Punch & Dashboard**: [http://localhost:3000/employee/dashboard](http://localhost:3000/employee/dashboard)
- **Attendance History**: [http://localhost:3000/employee/attendance](http://localhost:3000/employee/attendance)
- **Apply For Leave**: [http://localhost:3000/employee/leaves](http://localhost:3000/employee/leaves)
- **Holiday Calendar**: [http://localhost:3000/employee/calendar](http://localhost:3000/employee/calendar)

---

## 🧪 Testing & Verification

Run TypeScript compilation checks across both services to verify zero compilation errors:

```bash
# Frontend Compilation Check
cd Frontend
npx tsc --noEmit

# Backend Build Test
cd Backend
npm run build
```

---

## 🌐 Production Deployment

- **Backend (Render/Railway)**: Connect repository, set root to `Backend/`, build command `npm install && npm run build`, start command `node dist/server.js`.
- **Frontend (Vercel)**: Connect repository, set root to `Frontend/`, set `NEXT_PUBLIC_API_URL` to deployed Render URL.
