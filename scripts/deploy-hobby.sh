#!/bin/bash

echo "🚀 Deploying to Vercel (Hobby Plan Optimized)"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're logged in to Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Please login to Vercel first: vercel login"
    exit 1
fi

# Clean up any existing builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next
rm -rf .vercel

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

# Check if package-lock.json exists, if not create it
if [ ! -f "package-lock.json" ]; then
    echo "📦 Creating package-lock.json..."
    npm install --package-lock-only
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
npm run lint --silent || echo "⚠️  Linting issues found, continuing..."

# Build the project
echo "🔨 Building project locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🔗 Your app is now live!"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Local build failed. Please fix the errors before deploying."
    exit 1
fi
