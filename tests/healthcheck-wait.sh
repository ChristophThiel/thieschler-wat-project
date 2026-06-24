#!/bin/bash
set -e

until [ "$(docker inspect -f '{{.State.Health.Status}}' web_oc)" = "healthy" ]; do
  sleep 2
done
