#!/usr/bin/env bash

set -e

docker run --rm \
  --name nextjs-sandbox-zap \
  --add-host=host.docker.internal:host-gateway \
  -t zaproxy/zap-stable \
  zap-baseline.py \
  -t http://host.docker.internal:3000
