#!/bin/bash

echo "🔍 Checking Vercel Hobby Plan Limits..."

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Check for regions (not allowed on Hobby)
    if grep -q '"regions"' vercel.json; then
        echo "❌ Error: 'regions' property found in vercel.json. Multiple regions not supported on Hobby plan."
        exit 1
    fi
    
    # Check function duration
    if grep -q '"maxDuration"' vercel.json; then
        duration=$(grep -o '"maxDuration":[[:space:]]*[0-9]*' vercel.json | grep -o '[0-9]*')
        if [ "$duration" -gt 10 ]; then
            echo "❌ Error: maxDuration ($duration seconds) exceeds Hobby plan limit (10 seconds)."
            exit 1
        fi
    fi
    
    echo "✅ vercel.json configuration is compatible with Hobby plan"
else
    echo "⚠️  Warning: vercel.json not found. Using default configuration."
fi

# Check package.json
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    
    # Check Node.js version
    node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        echo "❌ Error: Node.js version $node_version is not supported. Minimum version is 18."
        exit 1
    fi
    
    echo "✅ Node.js version $node_version is supported"
else
    echo "❌ Error: package.json not found"
    exit 1
fi

echo "✅ All checks passed! Ready for deployment."
