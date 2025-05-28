# Fastify SOLID API

A clean and efficient RESTful API for managing gym check-ins, built with Fastify and designed around SOLID principles.

## 📋 Project Overview

This is a backend project that simulates a GymPass-style app. Users can sign up, check in at nearby gyms, and admins can manage gym data and validate check-ins. It’s a practical example of clean architecture applied to a real-world use case.

### 🔑 Features

- **Authentication**: Sign up, login, and refresh tokens using JWT
- **User Roles**: Member and admin roles with different permissions
- **Gyms**: Register gyms, search by name, and locate nearby gyms
- **Check-ins**: Log attendance, view history, and access user metrics

### 🏗️ Architecture

The project is structured using SOLID and Clean Architecture principles:

- **Repositories**: Abstract data layer using interfaces
- **Use Cases**: Self-contained business logic
- **Controllers**: Handle HTTP requests and responses
- **Middlewares**: Manage auth and access control

## 🚀 Tech Stack

- **Fastify** – Lightweight and fast web framework
- **TypeScript** – Type Safety
- **Prisma ORM** – Database Object Relational Mapping
- **PostgreSQL** – Relational database
- **Vitest** – Unit and integration testing
- **Zod** – Schema validation
- **Docker** – Containerized environment for local/dev
- **GitHub Actions** – Automated testing in CI

## 🛠️ Getting Started

### Requirements

- Docker & Docker Compose
- Node.js v20.x

### Running with Docker (Recommended)

1. Clone the repo:
   ```bash
   git clone https://github.com/lfbardi-don/fastify-solid-api.git
   cd fastify-solid-api
   ```

2. Start everything with Docker Compose:
   ```bash
   npm run docker:up
   # or just:
   docker-compose up -d
   ```

3. The API will be running at `http://localhost:3333`

4. To stop the containers:
   ```bash
   npm run docker:down
   # or:
   docker-compose down
   ```

### Running Locally (No Docker)

1. Clone the project:
   ```bash
   git clone https://github.com/lfbardi-don/fastify-solid-api.git
   cd fastify-solid-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy and edit the environment variables:
   ```bash
   cp .env.example .env
   # Then edit .env with your local config
   ```

4. Start the PostgreSQL container:
   ```bash
   docker-compose up -d api-solid-pg
   ```

5. Run the database migrations:
   ```bash
   npm run prisma:migrate:dev
   ```

6. Start the dev server:
   ```bash
   npm run start:dev
   ```

## 🧪 Running Tests

The project includes both unit and end-to-end tests:

```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📚 API Endpoints

### Auth

- `POST /sessions` – Login
- `PATCH /token/refresh` – Refresh JWT

### Users

- `POST /users` – Register
- `GET /me` – Get current user profile

### Gyms

- `POST /gyms` – Create a gym (admin only)
- `GET /gyms/search` – Search gyms by name
- `GET /gyms/nearby` – Find nearby gyms

### Check-ins

- `POST /gyms/:gymId/check-ins` – Check into a gym
- `PATCH /check-ins/:checkInId/validate` – Validate check-in (admin only)
- `GET /check-ins/history` – User’s check-in history
- `GET /check-ins/metrics` – Check-in metrics summary
