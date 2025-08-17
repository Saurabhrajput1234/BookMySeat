#!/bin/bash

# Environment setup script for Event Booking API

echo "Setting up Event Booking API environment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
else
    echo "✓ .env file already exists"
fi

# Check if specific environment files exist
if [ ! -f ".env.production" ]; then
    echo "Creating .env.production file..."
    cp .env.example .env.production
    echo "✓ .env.production file created"
else
    echo "✓ .env.production file already exists"
fi

if [ ! -f ".env.development" ]; then
    echo "Creating .env.development file..."
    cp .env.example .env.development
    echo "✓ .env.development file created"
else
    echo "✓ .env.development file already exists"
fi

echo ""
echo "Environment files setup complete!"
echo ""
echo "IMPORTANT: Please update the following files with your actual credentials:"
echo "  - .env (for default/local development)"
echo "  - .env.production (for production deployment)"
echo "  - .env.development (for development environment)"
echo ""
echo "Required credentials to update:"
echo "  - JWT_KEY (generate a secure 32+ character key)"
echo "  - STRIPE_SECRET_KEY (your Stripe secret key)"
echo "  - STRIPE_PUBLISHABLE_KEY (your Stripe publishable key)"
echo "  - SENDGRID_API_KEY (your SendGrid API key)"
echo "  - SENDGRID_FROM_EMAIL (verified sender email)"
echo "  - Database passwords (if different from defaults)"
echo ""
echo "After updating credentials, you can run:"
echo "  ./scripts/docker-run.sh          # For production"
echo "  ./scripts/docker-run.sh dev      # For development"