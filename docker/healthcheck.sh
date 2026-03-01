#!/bin/sh

# Health check script for meme-generator
# Returns 0 if healthy, 1 if unhealthy

HEALTH_URL="${HEALTH_URL:-http://localhost:2233/health}"

# Try to connect to the health endpoint
if curl -f -s -o /dev/null "$HEALTH_URL"; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed"
    exit 1
fi