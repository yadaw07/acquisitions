#!/bin/bash
set -e

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development.example and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Start in detached mode. Compose waits for neon-local's healthcheck
# before starting `app`, since app has `depends_on: condition: service_healthy`.
docker compose -f docker-compose.dev.yml up --build -d

echo "⏳ Waiting for Neon Local to report healthy..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' acquisitions-neon-local 2>/dev/null)" = "healthy" ]; do
    sleep 1
done

echo "📜 Applying latest schema with Drizzle..."
docker compose -f docker-compose.dev.yml exec app npm run db:migrate

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:3000"
echo "   Database:    postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "Tailing logs — press Ctrl+C to stop watching (containers keep running)."
echo "To stop the environment: docker compose -f docker-compose.dev.yml down"
echo ""

docker compose -f docker-compose.dev.yml logs -f app