#!/bin/sh
set -e

# If REDIS_URL is not set or points to localhost/127.0.0.1, start the embedded Redis server
if [ -z "$REDIS_URL" ] || echo "$REDIS_URL" | grep -q "127.0.0.1\|localhost"; then
  echo "[Twenty] Starting embedded Redis server on 127.0.0.1:6379..."
  redis-server --daemonize yes --protected-mode no --save "" --appendonly no
  export REDIS_URL="redis://127.0.0.1:6379"
fi

echo "[Twenty] Starting backend process..."
exec "$@"
