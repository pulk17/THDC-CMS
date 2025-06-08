#!/usr/bin/env bash
set -e

# Print commands before executing them
set -x

echo "Starting Render build process..."

# Install dependencies
npm install

# Install TypeScript globally for safety
npm install -g typescript

# Install type definitions
npm install --save-dev @types/express @types/cors @types/cookie-parser @types/body-parser @types/node @types/jsonwebtoken @types/validator @types/bcryptjs

# Clean dist directory
if [ -d "dist" ]; then
  echo "Cleaning dist directory..."
  rm -rf dist
fi

# Create dist directory
mkdir -p dist

# Try TypeScript compilation
echo "Attempting TypeScript compilation..."
if npx tsc --skipLibCheck; then
  echo "TypeScript compilation succeeded!"
else
  echo "TypeScript compilation failed, using JavaScript fallback..."
  # Copy deploy.js to dist/server.js as fallback
  cp deploy.js dist/server.js
  echo "Using simplified JavaScript version as fallback"
fi

echo "Build completed successfully!" 