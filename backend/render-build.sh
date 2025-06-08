#!/bin/bash

# Install dependencies
npm install

# Clean dist directory if it exists
if [ -d "dist" ]; then
  echo "Cleaning dist directory..."
  rm -rf dist
fi

# Build TypeScript
echo "Building TypeScript..."
npx tsc

echo "Build completed successfully!" 