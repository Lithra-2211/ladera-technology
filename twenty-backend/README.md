# Twenty CRM — Backend Layer (API & Worker Project)

This repository contains the standalone Headless Backend API and Worker processes of Twenty CRM.

## Architecture

- **Core Server**: `packages/twenty-server` (NestJS 11, TypeORM, GraphQL Yoga, REST API, Nest Commander CLI).
- **Email Engine**: `packages/twenty-emails` (React Email transactional templates).
- **Client SDK**: `packages/twenty-client-sdk` (Generated typed clients for Core and Metadata APIs).
- **Shared Contracts**: `packages/twenty-shared` (Isomorphic database events, types, and workflow engines).
- **Dev Utilities**: `packages/twenty-utils` (Environment bootstrap scripts).

## Quick Start

### 1. Start Infrastructure (Postgres & Redis)
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Build Shared Library & Server
```bash
yarn build:shared
yarn build
```

### 4. Initialize Database
```bash
yarn database:init
```

### 5. Start Server & Workers
```bash
# API Server on http://localhost:3000
yarn start

# In a separate terminal: BullMQ queue worker
yarn start:worker
```

## Configuration

Copy `.env.example` to `.env`:
```env
PORT=3000
SERVER_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
AUTH_COOKIE_ALLOWED_ORIGINS=http://localhost:3001
AUTH_COOKIE_SAME_SITE=lax
PG_DATABASE_URL=postgres://twenty:twenty@localhost:5432/default
REDIS_URL=redis://localhost:6379

==
```
