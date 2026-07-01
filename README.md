# TSS Backend

A backend service built with NestJS and TypeScript for orchestrating Threshold Signature Scheme (TSS) operations. It acts as a gateway between the frontend and multiple TSS nodes, managing vault lifecycle (initialization, key generation, signing) and EVM transaction broadcasting.

## Features

- NestJS v11 with modular architecture (`Health`, `TSS`, `User`)
- PostgreSQL integration via Prisma ORM
- Multi-node TSS orchestration (channel, vault init, keygen, sign)
- EVM integration with ethers.js (transaction broadcast and balance lookup)
- Background scheduler to periodically sync vault balances from the EVM network
- In-memory cache for TSS channel reuse
- Request validation with `class-validator` + global `ValidationPipe`
- Standardized API response wrapper via interceptor
- Swagger/OpenAPI documentation
- Security middlewares: `helmet`, `compression`, `cookie-parser`, CORS
- Docker Compose setup for local PostgreSQL

## Tech Stack

### Core

- NestJS
- TypeScript
- Node.js (recommend Node.js 20+)

### Data & ORM

- PostgreSQL
- Prisma

### Blockchain & TSS

- ethers.js for EVM RPC interaction
- `@nestjs/axios` for HTTP communication with TSS nodes

### API & Validation

- Swagger/OpenAPI via `@nestjs/swagger`
- `class-validator` + `class-transformer`
- `Joi` for environment variable validation

### Infrastructure & Utilities

- Docker Compose (local database)
- ESLint + Prettier + Jest

## Project Structure

```
tss-backend/
├── src/
│   ├── app/
│   │   ├── health/                # Health check endpoint
│   │   ├── tss/                   # TSS channel, vault, keygen, and sign endpoints
│   │   └── user/                  # Vault (user) listing and detail endpoints
│   ├── common/
│   │   ├── decorators/            # Custom Swagger decorator
│   │   ├── interceptors/          # Standard response formatter
│   │   └── middlewares/           # Request logging middleware
│   ├── configs/                   # Joi schema + typed runtime config mapping
│   ├── services/
│   │   ├── evm/                   # ethers.js JsonRpcProvider wrapper
│   │   ├── prisma/                # Prisma client provider and DI token
│   │   └── schedule/              # Background vault balance sync
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Bootstrap, middleware, versioning, swagger
├── prisma/
│   ├── models/                    # Prisma model definitions (User/vault)
│   └── migrations/                # Database migrations
├── test/                          # Jest e2e scaffold
├── docker-compose.yml             # PostgreSQL local container
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker + Docker Compose (for local PostgreSQL)
- Running TSS nodes (configured via environment variables)
- EVM RPC endpoint (e.g. local Hardhat/Anvil or testnet node)

## Environment Variables

Create a `.env` file in the project root (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Default variables:

```env
# environment
NODE_ENV=development
PORT=8080

# database
DATABASE_URL=postgresql://admin:root@localhost:5432/tss_backend_db

# tss
TSS_NODE1_URL="http://localhost:8000"
TSS_NODE1_LISTEN_ADDRESS="/ip4/0.0.0.0/tcp/10000"
TSS_NODE1_HOME="node1"
TSS_NODE2_URL="http://localhost:8001"
TSS_NODE2_LISTEN_ADDRESS="/ip4/0.0.0.0/tcp/20000"
TSS_NODE2_HOME="node2"
TSS_NODE3_URL="http://localhost:8002"
TSS_NODE3_LISTEN_ADDRESS="/ip4/0.0.0.0/tcp/30000"
TSS_NODE3_HOME="node3"

# rpc
RPC_EVM_URL="http://localhost:8545"
```

## Installation

```bash
yarn install
```

## Start Project

### 1) Start PostgreSQL (Docker)

```bash
yarn db:start
```

To stop and remove volumes:

```bash
yarn db:stop
```

### 2) Run Database Migrations

```bash
yarn db:generate
yarn db:migrate
```

For production deployments:

```bash
yarn db:deploy
```

### 3) Run API

Development mode:

```bash
yarn start:dev
```

Production mode:

```bash
yarn build
yarn start:prod
```

### 4) Open Swagger docs

When the server is running:

- API docs: http://localhost:8080/api

The app enables URI versioning (`v1`), so endpoints are prefixed with `/v1`.

## Main Endpoints

### Health

- `GET /v1/health`

### TSS

- `POST /v1/tss/channel` — create a TSS communication channel (cached until expiry)
- `POST /v1/tss/init-vault` — initialize a new vault across all TSS nodes
- `POST /v1/tss/generate-key` — run distributed key generation for a vault
- `POST /v1/tss/sign` — sign and broadcast an EVM transaction from a vault

### Users (Vaults)

- `GET /v1/users` — list all vaults with address and balance
- `GET /v1/users/:id` — get a vault by ID

## TSS Workflow

A typical vault setup and signing flow:

1. **Create channel** — `POST /v1/tss/channel` with `{ "expire": <minutes> }` to obtain a `channelId`.
2. **Initialize vault** — `POST /v1/tss/init-vault` with `{ "vault": "<name>", "password": "<password>" }` on all configured TSS nodes.
3. **Generate key** — `POST /v1/tss/generate-key` with vault credentials, `parties` (must match the number of TSS nodes), `threshold`, and `channelId`.
4. **Sign transaction** — `POST /v1/tss/sign` with vault credentials, `channelId`, `toAddress`, and `amount`. The signed raw transaction is broadcast to the EVM network.

## Available Scripts

- `yarn db:start` — start PostgreSQL container
- `yarn db:stop` — stop PostgreSQL and remove volume
- `yarn db:generate` — generate Prisma client
- `yarn db:migrate` — run Prisma migrations (development)
- `yarn db:deploy` — apply migrations (production)
- `yarn start` — start Nest app
- `yarn start:dev` — start with watch mode
- `yarn start:debug` — start in debug + watch mode
- `yarn start:prod` — run compiled output
- `yarn build` — build TypeScript to `dist`
- `yarn lint` — run ESLint with auto-fix
- `yarn format` — run Prettier on `src` and `test`
- `yarn test` — run unit tests
- `yarn test:e2e` — run e2e tests
- `yarn test:cov` — run test coverage

## Response Format

The global response interceptor wraps successful responses in this shape:

```json
{
  "success": true,
  "data": {},
  "message": "Some message",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Background Jobs

On startup, the `ScheduleModule` runs a background loop that fetches EVM balances for all vaults with a registered address and updates them in the database every 5 seconds.

## Security Notes

- `helmet`, `compression`, and cookie parser are enabled globally
- Request bodies are validated and sanitized via `ValidationPipe` (`whitelist: true`)
- Vault passwords are forwarded to TSS nodes over HTTP — ensure TSS nodes are reachable only over trusted networks in production
- CORS is currently set to `origin: '*'` — tighten this before production deployment

## Example-Only Disclaimer

This repository is a **service layer** for TSS orchestration, not a complete production treasury system.

Before shipping to real users, you should at least:

- add authentication and authorization for API endpoints
- add structured logging, monitoring, and alerting
- improve error model and exception filters
- harden security (rate limits, stricter CORS, secret management, audit logging)
- add full test coverage (unit, integration, e2e)
- add CI/CD and deployment strategy
- add migration/data lifecycle/backup strategy
- secure communication between this backend and TSS nodes (TLS, mTLS, or private network)
- review TSS threshold and party configuration for your security requirements
