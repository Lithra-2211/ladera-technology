# Stage 1: Build Frontend Assets
FROM node:24-alpine AS builder
WORKDIR /app

# Install build tools for native compilation if needed
RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock .yarnrc.yml tsconfig.base.json ./
COPY packages ./packages

# Ensure stub exists
RUN mkdir -p packages/twenty-front-component-renderer/src/remote/sandbox/generated && \
    echo 'export const FRONT_COMPONENT_SANDBOX_DOCUMENT = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;' > packages/twenty-front-component-renderer/src/remote/sandbox/generated/frontComponentSandboxDocument.ts

RUN yarn install
RUN yarn workspace twenty-shared run build
RUN yarn workspace twenty-front run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner

COPY --from=builder /app/packages/twenty-front/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
