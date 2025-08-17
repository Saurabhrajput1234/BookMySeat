#!/bin/bash

# Run script for Docker containers

ENVIRONMENT=${1:-production}

if [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
    echo "Starting development environment..."
    docker-compose --env-file .env.development -f docker-compose.dev.yml up --build -d
    echo "Development environment started!"
    echo "API available at: http://localhost:5000"
    echo "Database available at: localhost:5433"
    echo "Redis available at: localhost:6380"
else
    echo "Starting production environment..."
    docker-compose --env-file .env.production up --build -d
    echo "Production environment started!"
    echo "API available at: http://localhost:80 (via Nginx)"
    echo "Direct API access: http://localhost:8080"
    echo "Database available at: localhost:5432"
    echo "Redis available at: localhost:6379"
fi

echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"