#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Building prelegal:latest..."
docker build -t prelegal:latest "$PROJECT_DIR"
echo "Build complete."
