#!/bin/bash

# Render deployment script

echo "🚀 Deploying Event Booking API to Render..."

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please initialize git first."
    echo "Run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "git add ."
    echo "git commit -m 'Prepare for Render deployment'"
    echo ""
    echo "Uncommitted files:"
    git status --short
    exit 1
fi

# Check if remote repository is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote repository set. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/EventBookingAPI.git"
    echo "git push -u origin main"
    exit 1
fi

echo "✅ Pre-deployment checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and sign up/login"
echo ""
echo "3. Connect your GitHub repository"
echo ""
echo "4. Create a new Web Service with these settings:"
echo "   - Repository: Your GitHub repo"
echo "   - Branch: main"
echo "   - Build Command: (leave empty - using Dockerfile)"
echo "   - Start Command: (leave empty - using Dockerfile)"
echo "   - Dockerfile Path: ./Dockerfile.render"
echo ""
echo "5. Add environment variables in Render dashboard:"
echo "   - STRIPE_SECRET_KEY=your_stripe_secret_key"
echo "   - STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key"
echo "   - SENDGRID_API_KEY=your_sendgrid_api_key"
echo "   - SENDGRID_FROM_EMAIL=your_email@domain.com"
echo ""
echo "6. Deploy and wait for the build to complete"
echo ""
echo "🎉 Your API will be available at: https://your-service-name.onrender.com"