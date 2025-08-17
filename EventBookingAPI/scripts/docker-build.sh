#!/bin/bash

# Build script for Docker containers

echo "Building Event Booking API Docker containers..."

# Build production image
echo "Building production image..."
docker build -t eventbooking-api:latest -f Dockerfile .

# Build development image
echo "Building development image..."
docker build -t eventbooking-api:dev -f Dockerfile.dev .

echo "Build completed successfully!"

# Optional: Tag images with version
if [ ! -z "$1" ]; then
    echo "Tagging images with version: $1"
    docker tag eventbooking-api:latest eventbooking-api:$1
    docker tag eventbooking-api:dev eventbooking-api:$1-dev
fi

echo "Available images:"
docker images | grep eventbooking-api