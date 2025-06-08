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
  
  // Compile TypeScript
  log('Compiling TypeScript...');
  if (!execute('npx tsc')) {
    log('TypeScript compilation failed');
    process.exit(1);
  }
  
  log('Build completed successfully!');
}

build().catch(error => {
  log(`Build failed: ${error.message}`);
  process.exit(1);
}); 