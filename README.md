# Fitness Tracker SaaS

A full-stack SaaS-style fitness tracker built as a portfolio project. Users can manage workout plans, log completed sessions, browse an exercise library, and view progress stats on a personal dashboard. Admins can manage platform-wide exercises, categories, and users.

---

## Features

- **Authentication** — Register, login, persistent sessions via Laravel Sanctum
- **Dashboard** — Workout stats, weekly activity chart, recent session history
- **Exercise Library** — Browse 30+ global exercises with search and filters
- **Workout Plans** — Create and manage structured plans with exercises, sets, reps, and weight targets
- **Workout Logging** — Log completed workouts and track history with a detail view
- **Admin Panel** — Manage users, exercise categories, and global exercises (admin only)

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 19, TypeScript, Vite        |
| UI        | Bootstrap 5, React Bootstrap      |
| Routing   | React Router v7                   |
| HTTP      | Axios                             |
| Backend   | Laravel 11 (PHP 8.3)              |
| Auth      | Laravel Sanctum (Bearer tokens)   |
| Database  | MySQL                             |

---

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL (local or Docker)

---

## Local Setup

### Backend

```bash
cd backend

# Install PHP dependencies
composer install

# Copy the environment file and configure your database
cp .env.example .env
# Edit .env — set DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Generate app key
php artisan key:generate

# Run migrations and seed demo data
php artisan migrate --seed

# Start the API server (default: http://localhost:8000)
php artisan serve
```

### Frontend

```bash
cd frontend

# Install JS dependencies
npm install

# Create the environment file
cp .env.example .env.local
# Or create manually with:
echo "VITE_API_URL=http://localhost:8000/api" > .env.local

# Start the dev server (default: http://localhost:5173)
npm run dev
```

---

## Demo Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| User  | `demo@example.com`     | `password` |
| Admin | `admin@example.com`    | `password` |

The demo user has pre-seeded workout plans and 8 recent workout logs for a realistic dashboard view.

---

## Database Reset

To wipe and re-seed the database at any time:

```bash
cd backend
php artisan migrate:fresh --seed
```

---

## Key API Endpoints

All endpoints require `Authorization: Bearer <token>` except `register` and `login`.

| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| POST   | `/api/register`                       | Register a new user                |
| POST   | `/api/login`                          | Login — returns user + token       |
| POST   | `/api/logout`                         | Revoke current token               |
| GET    | `/api/me`                             | Get current authenticated user     |
| GET    | `/api/dashboard`                      | Dashboard stats + recent workouts  |
| GET    | `/api/exercises`                      | List all exercises (global + own)  |
| GET    | `/api/workout-plans`                  | List user's workout plans          |
| POST   | `/api/workout-plans`                  | Create a workout plan              |
| PUT    | `/api/workout-plans/{id}`             | Update a workout plan              |
| DELETE | `/api/workout-plans/{id}`             | Delete a workout plan              |
| GET    | `/api/workout-logs`                   | List user's workout logs           |
| POST   | `/api/workout-logs`                   | Log a completed workout            |
| GET    | `/api/workout-logs/{id}`              | Get a single log with exercises    |
| DELETE | `/api/workout-logs/{id}`              | Delete a workout log               |
| GET    | `/api/admin/stats`                    | Platform stats (admin only)        |
| GET    | `/api/admin/users`                    | List all users (admin only)        |
| GET    | `/api/admin/exercise-categories`      | List categories with counts        |
| POST   | `/api/admin/exercise-categories`      | Create a category                  |
| GET    | `/api/admin/exercises`                | List all global exercises          |
| POST   | `/api/admin/exercises`                | Create a global exercise           |

---

## Project Structure

```
fitness-tracker-saas/
├── backend/                  # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/        # Resource controllers
│   │   │   ├── Controllers/Api/Admin/  # Admin-only controllers
│   │   │   └── Middleware/             # EnsureUserIsAdmin
│   │   └── Models/                     # Eloquent models
│   ├── database/
│   │   ├── migrations/                 # DB schema
│   │   └── seeders/                    # Demo data
│   └── routes/api.php                  # All API routes
│
└── frontend/                 # React + TypeScript SPA
    └── src/
        ├── api/              # Axios API modules per resource
        ├── components/       # Shared UI components + dashboard widgets
        ├── context/          # AuthContext (session management)
        ├── pages/            # One component per route
        ├── routes/           # ProtectedRoute, AdminRoute, AppRoutes
        └── types/            # TypeScript interfaces
```

---
