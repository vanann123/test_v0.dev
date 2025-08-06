#!/bin/bash

# Script to check Vercel plan limitations and provide guidance

echo "🔍 Checking Vercel plan limitations..."

# Function to check current plan
check_plan() {
    echo "📋 Current Vercel plan limitations for Hobby:"
    echo "   ✅ Serverless Functions: 12 per deployment"
    echo "   ✅ Function Duration: 10 seconds max"
    echo "   ✅ Function Memory: 1024 MB"
    echo "   ❌ Multiple Regions: Not available"
    echo "   ❌ Edge Functions: Limited"
    echo "   ✅ Bandwidth: 100 GB/month"
    echo "   ✅ Builds: 6,000 minutes/month"
}

# Function to suggest optimizations
suggest_optimizations() {
    echo ""
    echo "💡 Optimizations for Hobby plan:"
    echo "   1. Remove 'regions' from vercel.json"
    echo "   2. Keep function duration ≤ 10 seconds"
    echo "   3. Optimize bundle size"
    echo "   4. Use static generation where possible"
    echo "   5. Minimize API routes"
}

# Function to check current config
check_config() {
    echo ""
    echo "🔧 Checking current vercel.json configuration..."
    
    if [ -f "vercel.json" ]; then
        if grep -q "regions" vercel.json; then
            echo "   ❌ Found 'regions' property - this will cause deployment failure"
            echo "   💡 Remove the 'regions' property from vercel.json"
        else
            echo "   ✅ No 'regions' property found"
        fi
        
        if grep -q "maxDuration.*[1-9][0-9]" vercel.json; then
            echo "   ⚠️  Function duration might exceed 10s limit"
            echo "   💡 Ensure maxDuration ≤ 10 for Hobby plan"
        else
            echo "   ✅ Function duration looks good"
        fi
    else
        echo "   ℹ️  No vercel.json found - using defaults"
    fi
}

# Run checks
check_plan
suggest_optimizations
check_config

echo ""
echo "🎯 Ready to deploy? Run: npm run deploy:hobby"
