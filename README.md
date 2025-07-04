# Real Estate App

A full-stack real estate application with a Next.js frontend and a Node.js/Express/Sequelize backend. Includes user authentication, PostgreSQL database, and robust validation and testing.

## Features

- User registration and login (with validation)
- PostgreSQL database (via Docker)
- Sequelize ORM
- Next.js frontend
- Jest & Supertest for backend testing

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d
```

### 3. Run the development server

```bash
yarn dev
```

- Backend runs on your configured port (see backend/src/server.ts)
- Frontend runs on http://localhost:3000

## Running Tests

### Run all tests

```bash
yarn test
```

### Watch mode

```bash
yarn test:watch
```

### Coverage report

```bash
yarn test:coverage
```

---
