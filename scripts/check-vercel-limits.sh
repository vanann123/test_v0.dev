#!/bin/bash

echo "🔍 Checking Vercel Hobby Plan Limits..."

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Check for regions (not allowed on Hobby)
    if grep -q "regions" vercel.json; then
        echo "❌ 'regions' property found - not supported on Hobby plan"
        exit 1
    fi
    
    # Check function duration
    if grep -q "maxDuration.*[1-9][0-9]" vercel.json; then
        echo "⚠️  Function duration might exceed 10 seconds (Hobby limit)"
    fi
    
    echo "✅ Configuration looks good for Hobby plan"
else
    echo "⚠️  No vercel.json found - using defaults"
fi

# Check package.json
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    
    # Check for build script
    if ! grep -q '"build"' package.json; then
        echo "❌ No build script found in package.json"
        exit 1
    fi
    
    echo "✅ Build script found"
fi

echo "🎉 All checks passed!"
