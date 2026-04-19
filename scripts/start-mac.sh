#!/bin/bash
set -e

IMAGE="prelegal:latest"
CONTAINER="prelegal"
DATA_DIR="$HOME/.prelegal/data"

mkdir -p "$DATA_DIR"

if docker ps -q -f name="$CONTAINER" | grep -q .; then
  echo "PreLegal is already running at http://localhost:8000"
  exit 0
fi

if docker ps -aq -f name="$CONTAINER" | grep -q .; then
  docker rm "$CONTAINER"
fi

docker run -d \
  --name "$CONTAINER" \
  -p 8000:8000 \
  -v "$DATA_DIR:/data" \
  "$IMAGE"

echo "PreLegal started at http://localhost:8000"
