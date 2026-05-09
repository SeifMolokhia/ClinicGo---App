# ClinicGo Backend

REST API for the ClinicGo doctor-booking platform.
Built with **Node.js**, **Express**, and **MongoDB** (Mongoose).

> AUC Course — **Milestone 3: Backend Development**

---

## Features

- **3 entities** (User, Doctor, Appointment) with proper relationships and indexes.
- **9 RESTful endpoints** covering CRUD on doctors, booking, and authentication.
- **JWT authentication** with bcrypt-hashed passwords (12 salt rounds).
- **Middleware:** request logging (morgan + custom), centralized error handler, JWT auth guard, admin-role guard, rate limiting on auth, Helmet security headers, CORS whitelist.
- **Validation** at the schema level (Mongoose) with descriptive error responses.
- **Double-booking prevention** via a partial unique index on (doctor + date + slot).

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Then edit `.env`:
- `MONGO_URI` — your MongoDB connection string. Easiest option: free tier on **MongoDB Atlas** (https://cloud.mongodb.com), then paste the connection string here.
- `JWT_SECRET` — generate a strong random string. From the terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

### 3. Seed the database

Populates 12 sample doctors and 2 demo accounts:

```bash
npm run seed
```

Demo logins:
| Email                    | Password    | Role    |
|--------------------------|-------------|---------|
| admin@clinicgo.com       | admin123    | admin   |
| patient@clinicgo.com     | patient123  | patient |

### 4. Run the server

```bash
npm run dev    # auto-reloads with nodemon
# or
npm start      # plain node
```

Server starts on `http://localhost:4000` by default.

---

## API Reference

Base URL: `http://localhost:4000/api`

### Auth

| Method | Path             | Auth   | Description                       |
|--------|------------------|--------|-----------------------------------|
| POST   | `/auth/register` | none   | Create a new patient account      |
| POST   | `/auth/login`    | none   | Login, returns `{ user, token }`  |
| GET    | `/auth/me`       | Bearer | Current authenticated user        |

### Doctors

| Method | Path             | Auth   | Description                                  |
|--------|------------------|--------|----------------------------------------------|
| GET    | `/doctors`       | none   | List doctors. Query: `q, specialty, location, sort, page, limit` |
| GET    | `/doctors/:id`   | none   | Get a single doctor                          |
| POST   | `/doctors`       | admin  | Create a doctor                              |
| PUT    | `/doctors/:id`   | admin  | Update a doctor                              |
| DELETE | `/doctors/:id`   | admin  | Delete a doctor                              |

### Appointments

| Method | Path                | Auth   | Description                              |
|--------|---------------------|--------|------------------------------------------|
| POST   | `/appointments`     | Bearer | Book a slot. Body: `{ doctorId, date, timeSlot, notes? }` |
| GET    | `/appointments`     | Bearer | List the current user's appointments     |
| DELETE | `/appointments/:id` | Bearer | Cancel an appointment (sets status=cancelled) |

### Health

| Method | Path           | Description           |
|--------|----------------|-----------------------|
| GET    | `/health`      | Server status & uptime |

---

## Auth header format

For protected endpoints:

```
Authorization: Bearer <token>
```

The token is returned by `POST /auth/register` and `POST /auth/login`.

---

## Quick test (curl)

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}' | jq -r .token)

# List doctors
curl http://localhost:4000/api/doctors

# Book an appointment
curl -X POST http://localhost:4000/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"<id-from-doctors-list>","date":"2026-05-20","timeSlot":"10:00 AM"}'

# List my appointments
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/appointments
```

---

## Project structure

```
backend/
├── server.js                     ← entry point
├── package.json
├── .env.example                  ← copy → .env, fill in secrets
├── .gitignore
└── src/
    ├── config/db.js              ← MongoDB connection
    ├── models/
    │   ├── User.js               ← bcrypt-hashed passwords
    │   ├── Doctor.js             ← indexed on specialty + location
    │   └── Appointment.js        ← unique compound index prevents double-booking
    ├── controllers/              ← business logic
    │   ├── authController.js
    │   ├── doctorController.js
    │   └── appointmentController.js
    ├── routes/                   ← Express routers
    │   ├── authRoutes.js
    │   ├── doctorRoutes.js
    │   └── appointmentRoutes.js
    ├── middleware/
    │   ├── auth.js               ← JWT verification + admin guard
    │   ├── errorHandler.js       ← centralized error responses
    │   └── logger.js             ← per-request timing logs
    ├── utils/
    │   └── asyncHandler.js       ← forwards async errors to errorHandler
    └── scripts/
        └── seed.js               ← npm run seed
```

---

## Security practices applied

- Passwords are hashed with **bcrypt (12 salt rounds)** and excluded from API responses (`select: false`).
- All secrets (`MONGO_URI`, `JWT_SECRET`) are read from environment variables; `.env` is gitignored.
- **Helmet** sets defensive HTTP headers.
- **Rate limiting** on `/api/auth/*` (20 req / 15 min) deters credential stuffing.
- **CORS whitelist** — only configured frontend origins can call the API.
- All input is validated at the Mongoose schema layer (length, format, enum).
- Mongoose's parameterized queries prevent **NoSQL injection**.
- Errors are normalized by a single middleware — stack traces are never leaked in production.
