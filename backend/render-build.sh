#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install TypeScript globally
echo "Installing TypeScript globally..."
npm install -g typescript

# Clean dist directory if it exists
if [ -d "dist" ]; then
  echo "Cleaning dist directory..."
  rm -rf dist
fi

# Build TypeScript
echo "Building TypeScript with tsc..."
tsc

echo "Build completed successfully!" 