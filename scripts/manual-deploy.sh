#!/bin/bash

echo "🚀 Manual deployment to Vercel..."

# Cài đặt Vercel CLI nếu chưa có
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login nếu chưa đăng nhập
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build locally để check lỗi
echo "🏗️  Building locally..."
npm run build

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment completed!"
