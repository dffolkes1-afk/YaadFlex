#!/usr/bin/env node
// Fix deployment by creating a properly named npm wrapper
const { spawn } = require('child_process');

console.log('Starting deployment with correct npm command...');

// Run the build first
const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

build.on('close', (code) => {
  if (code === 0) {
    console.log('Build completed successfully');
    // Now start the application
    const start = spawn('npm', ['start'], { stdio: 'inherit' });
    
    start.on('close', (startCode) => {
      process.exit(startCode);
    });
  } else {
    console.error('Build failed');
    process.exit(code);
  }
});