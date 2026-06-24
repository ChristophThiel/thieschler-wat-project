#!/bin/bash
set -e

for c in $(docker compose ps -q); do
  echo "Wait for $c..."
  until [ "$(docker inspect -f '{{.State.Health.Status}}' $c)" = "healthy" ]; do
    sleep 2
  done
done
