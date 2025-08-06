#!/bin/bash

# Deploy script for Vercel Hobby plan
# This script handles the limitations of the Hobby plan

echo "🚀 Starting deployment for Vercel Hobby plan..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login check
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Clean build
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .vercel

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "📊 Check your deployment status at: https://vercel.com/dashboard"
