#!/bin/bash
set -e

CONTAINER="prelegal"

if docker ps -q -f name="$CONTAINER" | grep -q .; then
  docker stop "$CONTAINER"
  docker rm "$CONTAINER"
  echo "PreLegal stopped."
else
  echo "PreLegal is not running."
fi
