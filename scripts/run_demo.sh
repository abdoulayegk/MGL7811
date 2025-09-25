#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$REPO_ROOT/docker-compose.yml"

require_binary() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' is not installed or not on PATH." >&2
    exit 1
  fi
}

# Ensure core tools exist
require_binary docker

if docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN=(docker compose -f "$COMPOSE_FILE")
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN=(docker-compose -f "$COMPOSE_FILE")
else
  echo "Error: Docker Compose v2 (docker compose) or v1 (docker-compose) is required." >&2
  exit 1
fi

require_binary lsof

check_port_free() {
  local port="$1"
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $port is already in use by another process. Please stop it and retry." >&2
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >&2
    exit 1
  fi
}

check_port_free 8888

if [ ! -f "$REPO_ROOT/german_credit_data.xls" ]; then
  echo "Warning: Expected dataset 'german_credit_data.xls' not found at repository root." >&2
  echo "The demo may fail to seed MongoDB without this file." >&2
fi

compose_cmd() {
  "${COMPOSE_BIN[@]}" "$@"
}

compose_cmd up --build -d

echo "✅ Demo environment is starting..."
echo "- Notebook URL: http://localhost:8888/lab"
echo "- Monitor logs: ${COMPOSE_BIN[*]} logs -f jupyterlab"
echo "- Stop services: ${COMPOSE_BIN[*]} down"