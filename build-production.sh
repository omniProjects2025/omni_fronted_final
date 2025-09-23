#!/bin/bash

# Production Build Script for OMNI Hospitals Frontend
# This script ensures proper production build with HTTPS API endpoints

echo "🔧 Building OMNI Hospitals Frontend for Production..."
echo "======================================================"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Verify environment configuration
echo "🔍 Verifying environment configuration..."
echo "Production environment should use HTTPS endpoints:"
grep -n "apiBaseUrl" src/environments/environment.prod.ts
grep -n "omniApiUrl" src/environments/environment.prod.ts

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm ci

# Build for production with explicit configuration
echo "🏗️ Building for production..."
ng build --configuration production --aot --output-hashing=all --source-map=false --optimization=true

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build output: dist/omni-project-frontend/"
    
    echo "🔍 Verifying build files..."
    ls -la dist/omni-project-frontend/
    
    echo "🌐 Environment verification:"
    echo "- Make sure your backend API is running on HTTPS"
    echo "- Backend should be at: https://api.omni-hospitals.in"
    echo "- CORS should allow: https://omnihospitals.in"
    
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
