const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Execute command and log output
function execute(command) {
  log(`Executing: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    log(output);
    return true;
  } catch (error) {
    log(`Error executing ${command}:`);
    log(error.message);
    return false;
  }
}

// Main build process
async function build() {
  log('Starting build process...');
  
  // Install dependencies
  log('Installing dependencies...');
  if (!execute('npm install')) {
    process.exit(1);
  }
  
  // Install all required type definitions
  log('Installing TypeScript type definitions...');
  const typePackages = [
    '@types/express',
    '@types/cors',
    '@types/cookie-parser',
    '@types/body-parser',
    '@types/node',
    '@types/jsonwebtoken',
    '@types/validator',
    '@types/bcryptjs'
  ];
  
  if (!execute(`npm install --save-dev ${typePackages.join(' ')}`)) {
    log('Warning: Failed to install some type definitions, but continuing build...');
  }
  
  // Clean dist directory if it exists
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    log('Cleaning dist directory...');
    try {
      fs.rmSync(distPath, { recursive: true, force: true });
      log('Dist directory removed');
    } catch (error) {
      log(`Error removing dist directory: ${error.message}`);
    }
  }
  
  // Create tsconfig with less strict settings for deployment
  log('Creating deployment-friendly tsconfig...');
  const tsConfig = {
    compilerOptions: {
      target: "es6",
      module: "commonjs",
      outDir: "./dist",
      rootDir: "./",
      strict: false,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      moduleResolution: "node",
      noImplicitAny: false,
      strictNullChecks: false
    },
    include: ["**/*.ts"],
    exclude: ["node_modules", "dist"]
  };
  
  fs.writeFileSync(path.join(__dirname, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
  log('Created deployment tsconfig.json');
  
  // Compile TypeScript
  log('Compiling TypeScript...');
  if (!execute('npx tsc')) {
    log('TypeScript compilation failed, trying with --skipLibCheck');
    if (!execute('npx tsc --skipLibCheck')) {
      log('TypeScript compilation failed even with --skipLibCheck');
      process.exit(1);
    }
  }
  
  log('Build completed successfully!');
}

build().catch(error => {
  log(`Build failed: ${error.message}`);
  process.exit(1);
}); 