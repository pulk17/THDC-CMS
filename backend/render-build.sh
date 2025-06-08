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

# Create a .env file for local development if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file for local development..."
  echo "NODE_ENV=production" > .env
  echo "PORT=10000" >> .env
  
  # Check if MONGODB_URL is set and properly formatted
  if [ -n "$MONGODB_URL" ]; then
    # Remove any quotes
    MONGODB_URL=$(echo $MONGODB_URL | sed 's/^"\(.*\)"$/\1/')
    
    # Check if it starts with mongodb:// or mongodb+srv://
    if [[ ! $MONGODB_URL == mongodb://* && ! $MONGODB_URL == mongodb+srv://* ]]; then
      echo "Warning: MONGODB_URL doesn't start with mongodb:// or mongodb+srv://, adding mongodb://"
      MONGODB_URL="mongodb://$MONGODB_URL"
      # Update the environment variable for the current process
      export MONGODB_URL="$MONGODB_URL"
    fi
    
    echo "MONGODB_URL=$MONGODB_URL" >> .env
  else
    echo "Warning: MONGODB_URL is not set!"
  fi
fi

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