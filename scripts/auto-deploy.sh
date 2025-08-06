#!/bin/bash

echo "🚀 Starting auto-deploy process..."

# Kiểm tra branch hiện tại
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $BRANCH"

# Kiểm tra uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  You have uncommitted changes:"
  git status --short
  read -p "Do you want to commit them? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    read -p "Enter commit message: " commit_msg
    git commit -m "$commit_msg"
  else
    echo "❌ Please commit or stash changes first"
    exit 1
  fi
fi

# Pull latest changes (nếu cần)
echo "📥 Pulling latest changes..."
git pull origin $BRANCH

# Push to trigger auto-deploy
echo "📤 Pushing to GitHub..."
git push origin $BRANCH

echo "✅ Code pushed! Vercel will auto-deploy in a few moments."
echo "🔗 Check deployment status at: https://vercel.com/dashboard"
