# Fitness Tracker SaaS

A production-deployed full-stack fitness tracker built with Laravel and React. Users can create workout plans, log completed workouts, browse an exercise library, and monitor their fitness progress through an intuitive web interface. The project was built as a portfolio application to demonstrate modern full-stack web development practices.

---

## Live Demo

**Application:** https://fitness-tracker-saas-one.vercel.app

**API:** https://fitness-tracker-saas.onrender.com

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | `demo@example.com` | `password` |

Feel free to explore the application using either demo account or register your own account.

---

## Features

- Secure authentication with Laravel Sanctum
- Personalized dashboard with workout statistics
- Searchable exercise library
- Create and manage workout plans
- Log completed workouts
- View workout history
- Admin dashboard for managing users, categories, and exercises
- Responsive React interface

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19, TypeScript, Vite |
| UI | Bootstrap 5, React Bootstrap |
| Routing | React Router v7 |
| Backend | Laravel 13 |
| Authentication | Laravel Sanctum |
| Database | PostgreSQL (Neon) |
| Deployment | Vercel (Frontend), Render (Backend), Docker |
| Version Control | Git & GitHub |

---

## Architecture

```
React SPA (Vite)
        │
        ▼
Laravel REST API
        │
        ▼
PostgreSQL (Neon)
```

---

## Running Locally

### Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

# Optional demo data
php artisan db:seed

php artisan serve
```

### Frontend

```bash
cd frontend

npm install

cp .env.example .env.local
```

Create `.env.local`

```env
VITE_API_URL=http://localhost:8000/api
```

Run the development server

```bash
npm run dev
```

---

## API Overview

Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/register` |
| POST | `/api/login` |
| POST | `/api/logout` |
| GET | `/api/me` |

Workout Plans

| Method | Endpoint |
|---------|----------|
| GET | `/api/workout-plans` |
| POST | `/api/workout-plans` |
| PUT | `/api/workout-plans/{id}` |
| DELETE | `/api/workout-plans/{id}` |

Workout Logs

| Method | Endpoint |
|---------|----------|
| GET | `/api/workout-logs` |
| POST | `/api/workout-logs` |
| GET | `/api/workout-logs/{id}` |
| DELETE | `/api/workout-logs/{id}` |

Exercises

| Method | Endpoint |
|---------|----------|
| GET | `/api/exercises` |

Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/api/dashboard` |

Admin

| Method | Endpoint |
|---------|----------|
| GET | `/api/admin/users` |
| GET | `/api/admin/stats` |
| GET | `/api/admin/exercise-categories` |
| POST | `/api/admin/exercise-categories` |
| GET | `/api/admin/exercises` |
| POST | `/api/admin/exercises` |

---

## Project Structure

```
fitness-tracker-saas/
├── backend/      # Laravel REST API
├── frontend/     # React + TypeScript SPA
└── README.md
```

---

## Deployment

| Service | Provider |
|----------|----------|
| Frontend | Vercel |
| Backend | Render (Docker) |
| Database | Neon PostgreSQL |

---

## Future Improvements

- Progress analytics and visualizations
- Personal record tracking
- Mobile UX improvements
- CSV import/export
- Exercise performance trends

---

## License

This project is provided as a portfolio project for demonstration and educational purposes.
