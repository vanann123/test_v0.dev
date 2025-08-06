#!/bin/bash

echo "🔍 Checking Vercel Hobby Plan Limits..."

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found"
    exit 1
fi

# Check for multiple regions (not allowed on Hobby)
if grep -q '"regions"' vercel.json; then
    echo "❌ Multiple regions detected - not supported on Hobby plan"
    echo "💡 Remove 'regions' property from vercel.json"
    exit 1
fi

# Check function duration (max 10s on Hobby)
max_duration=$(grep -o '"maxDuration":[[:space:]]*[0-9]*' vercel.json | grep -o '[0-9]*' | head -1)
if [ ! -z "$max_duration" ] && [ "$max_duration" -gt 10 ]; then
    echo "❌ Function duration ${max_duration}s exceeds Hobby limit (10s)"
    echo "💡 Reduce maxDuration to 10 or less"
    exit 1
fi

# Check for conflicting properties
if grep -q '"routes"' vercel.json && (grep -q '"headers"' vercel.json || grep -q '"redirects"' vercel.json || grep -q '"rewrites"' vercel.json); then
    echo "❌ Conflicting routing properties detected"
    echo "💡 Remove 'routes' property when using 'headers', 'redirects', or 'rewrites'"
    exit 1
fi

# Check package.json for build script
if ! grep -q '"build"' package.json; then
    echo "❌ No build script found in package.json"
    exit 1
fi

echo "✅ Configuration looks good for Hobby plan!"
echo "📊 Limits checked:"
echo "   - Single region: ✅"
echo "   - Function duration ≤ 10s: ✅"
echo "   - No routing conflicts: ✅"
echo "   - Build script exists: ✅"
