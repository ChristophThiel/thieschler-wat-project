#!/bin/bash
set -e

for c in $(docker compose ps -q); do
  echo "Wait for $c..."
  until [ "$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' $c)" = "healthy" ] \
     || [ "$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' $c)" = "running" ]; do
    sleep 2
  done
done
