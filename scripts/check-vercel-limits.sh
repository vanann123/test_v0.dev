#!/bin/bash

echo "📊 Checking Vercel Hobby Plan Limits"
echo "=================================="

# Check function count
function_count=$(find app -name "*.tsx" -o -name "*.ts" | grep -E "(page|route|api)" | wc -l)
echo "📁 Functions found: $function_count/12 (Hobby limit)"

if [ $function_count -gt 12 ]; then
    echo "❌ Too many functions for Hobby plan!"
    echo "💡 Consider combining functions or upgrading to Pro"
fi

# Check build size
if [ -d ".next" ]; then
    build_size=$(du -sh .next | cut -f1)
    echo "📦 Build size: $build_size"
fi

# Check vercel.json configuration
if [ -f "vercel.json" ]; then
    echo "⚙️  Vercel configuration:"
    
    # Check regions
    if grep -q '"regions"' vercel.json; then
        echo "❌ Multiple regions not supported on Hobby plan"
        echo "💡 Remove 'regions' property from vercel.json"
    else
        echo "✅ Single region configuration"
    fi
    
    # Check function duration
    max_duration=$(grep -o '"maxDuration":[[:space:]]*[0-9]*' vercel.json | grep -o '[0-9]*' | head -1)
    if [ ! -z "$max_duration" ] && [ $max_duration -gt 10 ]; then
        echo "❌ Function duration ${max_duration}s exceeds Hobby limit (10s)"
        echo "💡 Reduce maxDuration to 10 or less"
    else
        echo "✅ Function duration within limits"
    fi
    
    # Check for conflicting properties
    if grep -q '"routes"' vercel.json && (grep -q '"headers"' vercel.json || grep -q '"redirects"' vercel.json || grep -q '"rewrites"' vercel.json); then
        echo "❌ Configuration conflict: Cannot use 'routes' with newer properties"
        echo "💡 Remove 'routes' property and use 'headers', 'redirects', 'rewrites' instead"
    else
        echo "✅ No configuration conflicts"
    fi
fi

echo "=================================="
echo "🎯 Ready for Hobby plan deployment!"
