#!/bin/bash

echo "🚀 Deploying to Vercel (Hobby Plan Compatible)"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check current plan limits
echo "📊 Checking Vercel configuration..."

# Validate vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Check for conflicting properties
    if grep -q '"routes"' vercel.json && (grep -q '"headers"' vercel.json || grep -q '"redirects"' vercel.json || grep -q '"rewrites"' vercel.json); then
        echo "❌ Configuration conflict detected!"
        echo "Cannot use 'routes' with 'headers', 'redirects', or 'rewrites'"
        exit 1
    fi
    
    # Check function duration for Hobby plan
    if grep -q '"maxDuration".*[1-9][0-9]' vercel.json; then
        echo "⚠️  Warning: Function duration > 10s may not work on Hobby plan"
    fi
else
    echo "⚠️  No vercel.json found, using defaults"
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
