#!/bin/bash

echo "🚀 Deploying to Vercel (Hobby Plan Optimized)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if vercel.json exists and is valid
if [ ! -f "vercel.json" ]; then
    echo "⚠️  Warning: vercel.json not found. Creating optimized config..."
    cp scripts/vercel-hobby-config.json vercel.json
fi

# Generate package-lock.json if it doesn't exist
if [ ! -f "package-lock.json" ]; then
    echo "📦 Generating package-lock.json..."
    npm install --package-lock-only
fi

# Run type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix TypeScript errors before deploying."
    exit 1
fi

# Run build locally to catch errors
echo "🏗️  Testing build locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed locally. Please fix build errors before deploying."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
