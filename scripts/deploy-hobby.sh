#!/bin/bash

echo "🚀 Starting Hobby Plan Deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Check TypeScript
echo "🔍 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them first."
    exit 1
fi

# Build locally first
echo "🔨 Building locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed locally. Please fix build errors first."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
