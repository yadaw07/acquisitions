# Acquisitions API

[![Build Status](https://img.shields.io/github/actions/workflow/status/Yadaw/acquisitions-api/tests.yml?branch=main&label=Tests)](https://github.com/Yadaw/acquisitions-api/actions/workflows/tests.yml)
[![Lint & Format](https://img.shields.io/github/actions/workflow/status/Yadaw/acquisitions-api/lint-and-format.yml?branch=main&label=Lint%20%26%20Format)](https://github.com/Yadaw/acquisitions-api/actions/workflows/lint-and-format.yml)
[![Docker Build](https://img.shields.io/github/actions/workflow/status/Yadaw/acquisitions-api/docker-build-and-push.yml?branch=main&label=Docker%20Build)](https://github.com/Yadaw/acquisitions-api/actions/workflows/docker-build-and-push.yml)
[![Coverage](https://img.shields.io/codecov/c/github/Yadaw/acquisitions-api/main)](https://codecov.io/gh/Yadaw/acquisitions-api)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> **A robust, production-ready backend API for managing property/asset acquisitions, tracking workflows, deal pipelines, and related data management.**

---

## 📖 About / Overview

The **Acquisitions API** is a modern, secure, and scalable RESTful backend built to power acquisition workflows. It provides a solid foundation for managing acquisition targets, stakeholders, documents, and deal pipelines—complete with authentication, authorization, validation, structured logging, and comprehensive test coverage.

Designed with enterprise-grade patterns, the API follows clean architecture principles, separating concerns across routes, controllers, services, models, and middleware. It uses **PostgreSQL (via Neon)** for reliable relational data storage, **Drizzle ORM** for type-safe database access, and **JWT-based authentication** with role-based access control (RBAC).

### Problem It Solves

- **Fragmented acquisition data** → Centralized API for all acquisition-related entities
- **Security gaps** → Built-in authentication, authorization, rate limiting, and secure headers
- **Inconsistent validation** → Schema-first validation with Zod on all inputs
- **Observability blind spots** → Structured JSON logging (Winston) + request logging (Morgan)
- **Deployment complexity** → Multi-stage Docker builds, Neon Local for ephemeral dev databases, CI/CD pipelines

---

## ✨ Key Features

| Category                           | Features                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication & Authorization** | JWT-based auth with HttpOnly cookies, role-based access control (user/admin), secure password hashing (bcrypt), token refresh patterns    |
| **Data Validation**                | Zod schema validation on all request bodies, query params, and route parameters with detailed error formatting                            |
| **Error Handling**                 | Centralized error handling with consistent JSON responses, proper HTTP status codes, and structured logging                               |
| **Logging & Observability**        | Winston for structured JSON logging (production) / pretty logging (development), Morgan for HTTP request logging, configurable log levels |
| **Security Hardening**             | Helmet for secure HTTP headers, CORS configuration, Arcjet for bot detection/rate limiting, cookie parser with secure flags               |
| **Database**                       | PostgreSQL via Neon (serverless), Drizzle ORM for type-safe queries, migrations, and schema management                                    |
| **API Design**                     | RESTful endpoints, consistent response format, health check endpoint, 404 handling                                                        |
| **Developer Experience**           | Hot-reload in development, ESLint + Prettier, comprehensive test suite (Jest + Supertest), Docker support                                 |
| **CI/CD**                          | GitHub Actions for linting, testing, Docker builds, and coverage reporting                                                                |

---

## 🛠 Tech Stack

| Layer                | Technology                   | Version     |
| -------------------- | ---------------------------- | ----------- |
| **Runtime**          | Node.js                      | 18+ (ESM)   |
| **Framework**        | Express.js                   | 5.x         |
| **Language**         | JavaScript (ES Modules)      | —           |
| **Database**         | PostgreSQL (Neon Serverless) | —           |
| **ORM**              | Drizzle ORM                  | 0.45+       |
| **Validation**       | Zod                          | 4.x         |
| **Authentication**   | JWT (jsonwebtoken)           | 9.x         |
| **Password Hashing** | bcrypt                       | 6.x         |
| **Logging**          | Winston                      | 3.x         |
| **HTTP Logging**     | Morgan                       | 1.x         |
| **Security**         | Helmet, CORS, Arcjet         | Latest      |
| **Testing**          | Jest, Supertest              | 30.x, 7.x   |
| **Code Quality**     | ESLint, Prettier             | Latest      |
| **Containerization** | Docker, Docker Compose       | Multi-stage |
| **CI/CD**            | GitHub Actions               | —           |

---

## 🚀 Getting Started

### Prerequisites

| Tool                        | Version | Notes                                                       |
| --------------------------- | ------- | ----------------------------------------------------------- |
| **Node.js**                 | 18+     | LTS recommended                                             |
| **npm**                     | 9+      | Bundled with Node.js                                        |
| **Docker & Docker Compose** | Latest  | For containerized development                               |
| **Neon Account**            | —       | Free tier at [console.neon.tech](https://console.neon.tech) |
| **Git**                     | Latest  | For version control                                         |

> **Note:** For local development without Docker, you'll need a PostgreSQL instance. Neon Local (via Docker) is the recommended approach—it creates ephemeral database branches per session.

### Environment Variables

Create the appropriate `.env` file for your environment. **Never commit real credentials to version control.**

#### Development (`.env.development`)

```bash
# ─────────────────────────────────────────────────────
# NEON LOCAL (Required for docker:dev)
# ─────────────────────────────────────────────────────
NEON_API_KEY=neon_api_1ABCDEFGHijklmnop1234567890
NEON_PROJECT_ID=steep-forest-12345678
PARENT_BRANCH_ID=main

# ─────────────────────────────────────────────────────
# APPLICATION SETTINGS
# ─────────────────────────────────────────────────────
JWT_SECRET=your-development-jwt-secret-key-here-min-32-chars
PORT=3000
LOG_LEVEL=debug
LOG_TO_FILE=false
NODE_ENV=development

# ─────────────────────────────────────────────────────
# SECURITY (Arcjet) — Optional but recommended
# ─────────────────────────────────────────────────────
ARCJET_KEY=ajkey_your_arcjet_key_here
ARCJET_ENV=development
```

#### Production (`.env.production`)

```bash
# ─────────────────────────────────────────────────────
# NEON CLOUD DATABASE (Direct connection)
# ─────────────────────────────────────────────────────
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require

# ─────────────────────────────────────────────────────
# APPLICATION SETTINGS
# ─────────────────────────────────────────────────────
JWT_SECRET=your-strong-production-jwt-secret-min-32-chars-random
PORT=3000
LOG_LEVEL=info
LOG_TO_FILE=true
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# ─────────────────────────────────────────────────────
# SECURITY (Arcjet)
# ─────────────────────────────────────────────────────
ARCJET_KEY=ajkey_your_production_arcjet_key
ARCJET_ENV=production
```

| Variable           | Required  | Description                                                           |
| ------------------ | --------- | --------------------------------------------------------------------- |
| `DATABASE_URL`     | Prod only | Direct Neon Cloud connection string                                   |
| `NEON_API_KEY`     | Dev only  | Neon API key for Neon Local                                           |
| `NEON_PROJECT_ID`  | Dev only  | Neon project identifier                                               |
| `PARENT_BRANCH_ID` | Dev only  | Branch to fork from (usually `main`)                                  |
| `JWT_SECRET`       | **Yes**   | Secret for signing JWTs (min 32 chars, use `openssl rand -base64 32`) |
| `PORT`             | No        | Server port (default: 3000)                                           |
| `LOG_LEVEL`        | No        | `debug`, `info`, `warn`, `error` (default: `info`)                    |
| `LOG_TO_FILE`      | No        | Enable file logging in `logs/` (default: `false`)                     |
| `CORS_ORIGIN`      | Prod      | Allowed origin for CORS (default: `*`)                                |
| `ARCJET_KEY`       | No        | Arcjet API key for bot protection/rate limiting                       |
| `ARCJET_ENV`       | No        | Arcjet environment (`development`/`production`)                       |

### Installation & Setup

#### Option 1: Docker (Recommended for Development)

```bash
# 1. Clone the repository
git clone https://github.com/Yadaw/acquisitions-api.git
cd acquisitions-api

# 2. Configure development environment
cp .env.development.example .env.development
# Edit .env.development with your Neon credentials

# 3. Start development stack (Neon Local + App with hot-reload)
npm run docker:dev

# 4. Verify the API is running
curl http://localhost:3000/health
# Expected: {"status":"OK","timestamps":"...","uptime":...}

# 5. Run database migrations (in another terminal)
docker exec acquisitions-app-dev npm run db:migrate
```

**Development URLs:**

- API: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`
- Prometheus metrics: `http://localhost:3000/metrics`
- Prometheus UI: `http://localhost:9090`
- API Root: `http://localhost:3000/api`
- Neon Local: `localhost:5432` (PostgreSQL)
- Drizzle Studio: `http://localhost:4983` (run `docker exec acquisitions-app-dev npm run db:studio`)

Prometheus is configured in [`prometheus/prometheus.yml`](./prometheus/prometheus.yml)
and starts with the development Compose stack:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

The Prometheus container joins the same Compose bridge network as the API and
scrapes `app:3000/metrics`. Use the Compose **service name** (`app`) and the
container port (`3000`) for this internal connection; do not use `localhost`
or the host-published port from inside Prometheus. The same setup is included
in the production Compose file. Prometheus stores its data in a named volume
with a 15-day retention period. Its UI is bound to `127.0.0.1:9090`, so it is
not exposed on external network interfaces by default.

The default 15-second scrape interval and 10-second timeout are suitable for
local development and keep the timeout shorter than the interval. For faster
feedback while debugging, both can be reduced to `5s` in `prometheus.yml`.
Restart or recreate the Prometheus container after changing its configuration:

```bash
docker compose -f docker-compose.dev.yml restart prometheus
```

#### Option 2: Local Node.js (Without Docker)

```bash
# 1. Clone and install dependencies
git clone https://github.com/Yadaw/acquisitions-api.git
cd acquisitions-api
npm ci

# 2. Set up environment
cp .env.development.example .env.development
# Edit with your Neon credentials (or local PostgreSQL DATABASE_URL)

# 3. Run database migrations
npm run db:migrate

# 4. Start development server with hot-reload
npm run dev

# 5. In another terminal, run tests
npm test
```

#### Option 3: Production Deployment

```bash
# 1. Configure production environment
cp .env.production.example .env.production
# Edit with production credentials

# 2. Build and start production stack
npm run docker:prod

# 3. Run migrations (one-time)
docker exec acquisitions-app-prod npm run db:migrate
```

---

## 📚 API Documentation / Endpoints

### Base URL

| Environment | URL                          |
| ----------- | ---------------------------- |
| Development | `http://localhost:3000`      |
| Production  | `https://api.yourdomain.com` |

All endpoints are prefixed with `/api`.

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint             | Auth        | Description                                       |
| ------ | -------------------- | ----------- | ------------------------------------------------- |
| `POST` | `/api/auth/sign-up`  | ❌ Public   | Register a new user account                       |
| `POST` | `/api/auth/sign-in`  | ❌ Public   | Authenticate user, returns JWT in HttpOnly cookie |
| `POST` | `/api/auth/sign-out` | ✅ Required | Clear auth cookie, invalidate session             |

#### `POST /api/auth/sign-up`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user" // optional, defaults to "user"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

_Sets `token` HttpOnly cookie._

#### `POST /api/auth/sign-in`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

_Sets `token` HttpOnly cookie._

#### `POST /api/auth/sign-out`

**Success Response (200):**

```json
{
  "message": "User signed out successfully"
}
```

_Clears `token` cookie._

---

### User Management Endpoints (`/api/users`)

| Method   | Endpoint         | Auth        | Roles           | Description                                       |
| -------- | ---------------- | ----------- | --------------- | ------------------------------------------------- |
| `GET`    | `/api/users`     | ✅ Required | `admin`         | List all users (paginated)                        |
| `GET`    | `/api/users/:id` | ✅ Required | `user`, `admin` | Get user by ID (own or admin)                     |
| `PUT`    | `/api/users/:id` | ✅ Required | `user`, `admin` | Update user (own account; admin can change roles) |
| `DELETE` | `/api/users/:id` | ✅ Required | `user`, `admin` | Delete user (own account or admin)                |

#### `GET /api/users` (Admin only)

**Headers:** `Cookie: token=<jwt>`

**Success Response (200):**

```json
{
  "message": "Successfully retrieved users",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### `GET /api/users/:id`

**Headers:** `Cookie: token=<jwt>`

**Success Response (200):**

```json
{
  "message": "Successfully retrieved user",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### `PUT /api/users/:id`

**Headers:** `Cookie: token=<jwt>`

**Request Body (all optional):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin" // admin only
}
```

**Success Response (200):**

```json
{
  "message": "User 1 updated successfully",
  "updatedUser": [
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-20T14:22:00.000Z"
    }
  ]
}
```

#### `DELETE /api/users/:id`

**Headers:** `Cookie: token=<jwt>`

**Success Response (200):**

```json
{
  "message": "User 1 deleted successfully"
}
```

---

### Health & Utility Endpoints

| Method | Endpoint  | Auth | Description                              |
| ------ | --------- | ---- | ---------------------------------------- |
| `GET`  | `/`       | ❌   | Root endpoint, returns greeting          |
| `GET`  | `/health` | ❌   | Health check (status, timestamp, uptime) |
| `GET`  | `/api`    | ❌   | API info endpoint                        |
| `GET`  | `/metrics`| ❌   | Prometheus metrics                       |

#### `GET /metrics`

The `/metrics` endpoint returns Prometheus text-format metrics. It includes
default Node.js process/system metrics and HTTP request count and duration,
with request labels based on the Express route template (for example,
`/api/users/:id`) rather than individual parameter values.

Configure your Prometheus server to scrape `http://<api-host>:<port>/metrics`.
The endpoint is not authenticated, so restrict access to it through your
deployment's network or ingress controls.

#### `GET /health`

**Success Response (200):**

```json
{
  "status": "OK",
  "timestamps": "2024-01-20T14:22:00.000Z",
  "uptime": 1234.56
}
```

---

### Error Response Format

All errors follow a consistent structure:

```json
{
  "error": "Human-readable error message",
  "details": [
    // Present for validation errors
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_type"
    }
  ]
}
```

| Status Code | Meaning                              |
| ----------- | ------------------------------------ |
| `200`       | Success                              |
| `201`       | Created                              |
| `400`       | Bad Request (validation error)       |
| `401`       | Unauthorized (missing/invalid token) |
| `403`       | Forbidden (insufficient permissions) |
| `404`       | Not Found                            |
| `409`       | Conflict (e.g., duplicate email)     |
| `500`       | Internal Server Error                |

---

## 🧪 Running Tests

```bash
# Run full test suite with coverage
npm test

# Run tests in watch mode (development)
npm test -- --watch

# Run specific test file
npm test -- tests/auth.test.js

# Generate coverage report only
npm test -- --coverage
```

### Test Configuration

- **Framework:** Jest 30 + Supertest 7
- **Environment:** Node with experimental VM modules
- **Coverage:** V8 provider, outputs to `coverage/`
- **Test Match:** `**/tests/**/*.test.js`
- **Setup:** `dotenv/config` loaded automatically

### CI Test Pipeline

GitHub Actions runs tests on every push/PR to `main` and `staging` with:

- Node.js 20.x
- PostgreSQL test database (via Neon)
- Coverage artifacts uploaded (30-day retention)
- Test summary in GitHub Actions UI

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork & Clone**

   ```bash
   git clone https://github.com/Yadaw/acquisitions-api.git
   cd acquisitions-api
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies & Configure Env**

   ```bash
   npm ci
   cp .env.development.example .env.development
   # Edit with your credentials
   ```

4. **Run Development Stack**

   ```bash
   npm run docker:dev
   # In another terminal:
   docker exec acquisitions-app-dev npm run db:migrate
   ```

5. **Make Changes**
   - Follow existing code patterns (ESM, async/await, proper error handling)
   - Add tests for new functionality
   - Update validations/schemas as needed

6. **Run Quality Checks**

   ```bash
   npm run lint        # ESLint
   npm run format:check # Prettier
   npm test            # Full test suite
   ```

7. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Target `main` branch
   - Fill out the PR template
   - Ensure all CI checks pass

### Code Style

- **ES Modules** (`import`/`export`) — no CommonJS
- **Async/await** — avoid raw promises
- **Zod schemas** for all input validation
- **Winston logger** — use `logger.info/warn/error` with structured metadata
- **Error handling** — throw errors in services, catch in controllers, pass to `next()`
- **No console.log** — use the logger

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile endpoint
fix: handle null role in authentication
docs: update API endpoint documentation
refactor: extract validation logic to utils
test: add integration tests for auth flow
chore: update dependencies
```

---

## 🐳 Docker Commands Reference

| Command                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `npm run docker:dev`        | Start dev stack (Neon Local + App with hot-reload) |
| `npm run docker:dev:down`   | Stop dev stack and remove volumes                  |
| `npm run docker:logs:dev`   | View dev container logs                            |
| `npm run docker:build:dev`  | Rebuild dev image                                  |
| `npm run docker:prod`       | Start production stack (detached)                  |
| `npm run docker:prod:down`  | Stop production stack                              |
| `npm run docker:logs:prod`  | View production logs                               |
| `npm run docker:build:prod` | Rebuild production image                           |

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for comprehensive Docker guide.

---

## 📦 Available Scripts

| Script         | Command                                                 | Description                         |
| -------------- | ------------------------------------------------------- | ----------------------------------- |
| `start`        | `node src/index.js`                                     | Start production server             |
| `dev`          | `node --watch src/index.js`                             | Start dev server with hot-reload    |
| `lint`         | `eslint .`                                              | Run ESLint                          |
| `lint:fix`     | `eslint . --fix`                                        | Auto-fix ESLint issues              |
| `format`       | `prettier --write .`                                    | Format with Prettier                |
| `format:check` | `prettier --check .`                                    | Check Prettier formatting           |
| `db:generate`  | `drizzle-kit generate`                                  | Generate migration files            |
| `db:migrate`   | `drizzle-kit migrate`                                   | Run pending migrations              |
| `db:studio`    | `drizzle-kit studio`                                    | Open Drizzle Studio UI              |
| `test`         | `cross-env NODE_OPTIONS=--experimental-vm-modules jest` | Run test suite                      |
| `docker:dev`   | `sh ./scripts/dev.sh`                                   | Start Docker dev environment        |
| `docker:prod`  | `sh ./scripts/prod.sh`                                  | Start Docker production environment |

---

## 🔒 Security Considerations

- **JWT Secrets:** Use strong, randomly generated secrets (`openssl rand -base64 32`). Rotate periodically.
- **Cookies:** HttpOnly, Secure (production), SameSite=Lax
- **Passwords:** bcrypt with cost factor 10
- **Headers:** Helmet sets CSP, HSTS, X-Frame-Options, etc.
- **Rate Limiting:** Arcjet provides bot detection and rate limiting
- **CORS:** Configure `CORS_ORIGIN` in production
- **Environment Variables:** Never commit `.env.*` files; use GitHub Secrets in CI
- **Database:** Neon provides TLS encryption; use `sslmode=require` in production
- **Non-root User:** Docker runs as `nodejs` user (UID 1001)

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support & Resources

- **Documentation:** [DOCKER_SETUP.md](DOCKER_SETUP.md) for Docker details
- **Issues:** [GitHub Issues](https://github.com/Yadaw/acquisitions-api/issues)
- **Neon Docs:** [Neon Serverless](https://neon.com/docs/serverless/serverless-driver)
- **Drizzle ORM:** [Drizzle Documentation](https://orm.drizzle.team/)
- **Express.js:** [Express Guide](https://expressjs.com/en/guide/routing.html)

---

<div align="center">
  <strong>Built with ❤️ for modern acquisition workflows</strong>
  <br />
  <sub>Node.js • Express • PostgreSQL • Drizzle • JWT • Docker</sub>
</div>
