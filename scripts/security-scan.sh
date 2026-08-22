#!/usr/bin/env bash

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
REPORT_DIR="$(pwd)/reports/security/${TIMESTAMP}"

mkdir -p "$REPORT_DIR"

docker run --rm \
  --name nextjs-sandbox-zap \
  --add-host=host.docker.internal:host-gateway \
  -v "$REPORT_DIR:/zap/wrk" \
  -t zaproxy/zap-stable \
  zap-baseline.py \
  -t http://host.docker.internal:3000 \
  -r zap-report.html \
  -J zap-report.json

echo
echo "ZAP report generated:"
echo "$REPORT_DIR"
