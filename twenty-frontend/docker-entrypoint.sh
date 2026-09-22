#!/bin/sh
set -e

if [ -n "$REACT_APP_SERVER_BASE_URL" ]; then
  echo "Configuring runtime backend URL: $REACT_APP_SERVER_BASE_URL"
  sed -i "s|window._env_ = {.*};|window._env_ = { REACT_APP_SERVER_BASE_URL: \"$REACT_APP_SERVER_BASE_URL\" };|g" /usr/share/nginx/html/index.html
fi

exec "$@"
