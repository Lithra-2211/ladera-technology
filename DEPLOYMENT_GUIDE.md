# Production Deployment & Hosting Runbook

This document is for the **DevOps Engineer / Hosting Team** responsible for deploying Twenty CRM (Frontend & Backend) to the cloud (Azure, AWS, or Linux Docker VM).

---

## 1. System Architecture

| Component | Technology | Recommended Azure Service | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Linaria | **Azure Static Web Apps** | Pure Single-Page Application (SPA) |
| **Backend** | NestJS 11, TypeORM, GraphQL | **Azure App Service (Linux Container)** *(or Azure Container Apps)* | Node.js REST & GraphQL API on port `3000` |
| **Database** | PostgreSQL 16 | **Azure Database for PostgreSQL Flexible Server** | Relational data & schema |
| **Cache & Queue** | Redis | **Upstash Redis (Free Tier)** *(or Docker `redis:7-alpine`)* | Required by backend BullMQ & cache engines |

---

## 2. Infrastructure Requirements & Pre-requisites

1. **PostgreSQL 16**:
   - Azure PostgreSQL Flexible Server (`B1ms` burstable is sufficient for low-to-medium usage).
   - Enable firewall rule: Allow public access from Azure services (or setup VNet integration).
2. **Redis**:
   - **Important**: Twenty backend strictly requires a Redis connection string for startup (BullMQ queues and caching).
   - Cost-saving tip: Use [Upstash Redis](https://upstash.com/) (free tier, 10,000 requests/day, zero cost) or spin up a lightweight `redis:7-alpine` container.
3. **Container Registry (if using Docker)**:
   - Azure Container Registry (ACR) or Docker Hub to push the backend container image.

---

## 3. Backend Deployment

### A. Backend Environment Variables (.env)
Configure these in Azure App Service / Container App **Configuration > Application Settings**:

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production environment flag |
| `PORT` | `3000` | Port backend listens on |
| `SERVER_URL` | `https://api.yourdomain.com` | Public URL of the backend API (must be HTTPS in prod) |
| `FRONTEND_URL` | `https://app.yourdomain.com` | Public URL of the frontend SPA |
| `AUTH_COOKIE_ALLOWED_ORIGINS` | `https://app.yourdomain.com` | Allowed origin for authentication cookies |
| `AUTH_COOKIE_SAME_SITE` | `none` | Required for cross-domain HTTPS cookies |
| `AUTH_COOKIE_SECURE` | `true` | Required when `AUTH_COOKIE_SAME_SITE=none` |
| `PG_DATABASE_URL` | `postgres://user:pass@host:5432/default?sslmode=require` | Azure PostgreSQL connection URL |
| `REDIS_URL` | `rediss://default:pass@host:6379` | Redis connection URL |
| `APP_SECRET` | *(Generate a 32+ character random string)* | Encryption key for auth tokens |
| `STORAGE_TYPE` | `local` | Local file storage (or `azure` / `s3`) |

### B. One-Time Database Initialization
Before starting the backend for the first time, initialize the database tables:
```bash
cd twenty-backend
yarn install
yarn build:shared
yarn build

# Ensure your local IP is allowed in Azure Postgres firewall temporarily, then run:
PG_DATABASE_URL="<your_azure_postgres_connection_string>" yarn database:init
```

### C. Build & Deploy Backend Container
A production multi-stage Dockerfile is located at `twenty-backend/Dockerfile.server`.

```bash
cd twenty-backend

# 1. Build image
docker build -f Dockerfile.server -t <acr_name>.azurecr.io/twenty-backend:latest .

# 2. Login to Azure Container Registry
az acr login --name <acr_name>

# 3. Push image
docker push <acr_name>.azurecr.io/twenty-backend:latest
```

In Azure App Service:
- Create **Web App** -> **Linux** -> **Docker Container**.
- Select the pushed ACR image.
- Set App Setting: `WEBSITES_PORT=3000`.
- Add the environment variables from Table 3A.

---

## 4. Frontend Deployment (Azure Static Web Apps)
Azure Static Web Apps is the standard, optimized service for React/Vite SPAs with global CDN distribution and SSL.

1. **Routing config**:
   The routing fallback file is located at `twenty-frontend/packages/twenty-front/public/staticwebapp.config.json` to handle client-side routing and prevent 404s on browser refresh.

2. **Configure Backend URL**:
   In `twenty-frontend/packages/twenty-front/index.html`, set the production backend URL:
   ```html
   <!-- BEGIN: Twenty Config -->
   <script id="twenty-env-config">
     window._env_ = {
       REACT_APP_SERVER_BASE_URL: "https://<your-backend-url>"
     };
   </script>
   <!-- END: Twenty Config -->
   ```

3. **Build Static Production Assets**:
   ```bash
   cd twenty-frontend
   yarn install
   yarn workspace twenty-shared run build
   yarn workspace twenty-front run build
   ```

4. **Deploy**:
   - The compiled static files are generated in `twenty-frontend/packages/twenty-front/build`.
   - Point your Azure Static Web App configuration or deployment workflow to:
     - **App location**: `twenty-frontend`
     - **Output location**: `packages/twenty-front/build`

---

## 5. Deployment Verification Checklist

- [ ] PostgreSQL is accessible and `yarn database:init` completed without errors.
- [ ] Redis URL is reachable (ping succeeds).
- [ ] Backend is running at `https://<backend-host>/healthz` or returns HTTP 200 on root.
- [ ] Frontend can make requests to `${REACT_APP_SERVER_BASE_URL}/metadata` and `${REACT_APP_SERVER_BASE_URL}/graphql`.
- [ ] `AUTH_COOKIE_SAME_SITE=none` and `AUTH_COOKIE_SECURE=true` are active on the backend so login session cookies persist.
- [ ] CORS is not blocked: `AUTH_COOKIE_ALLOWED_ORIGINS` includes the exact frontend domain.
