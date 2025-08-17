#!/bin/bash

# Database migration script for Docker

ENVIRONMENT=${1:-production}

if [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
    echo "Running migrations in development environment..."
    docker-compose --env-file .env.development -f docker-compose.dev.yml exec api-dev dotnet ef database update
else
    echo "Running migrations in production environment..."
    docker-compose --env-file .env.production exec api dotnet ef database update
fi

echo "Migration completed!"