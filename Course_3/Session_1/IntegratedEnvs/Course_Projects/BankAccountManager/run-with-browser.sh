#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

docker compose up --build -d

URL_FRONTEND="http://localhost:8081"
URL_SCALAR="http://localhost:5001/scalar"

if command -v open >/dev/null 2>&1; then
  open "$URL_FRONTEND"
  open "$URL_SCALAR"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL_FRONTEND" || true
  xdg-open "$URL_SCALAR" || true
fi

echo "Frontend: $URL_FRONTEND"
echo "API docs (Scalar): $URL_SCALAR"


