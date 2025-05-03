#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${COLORS.cyan}
========================================
  Cursor Prompter Installation Helper
========================================
${COLORS.reset}`);

// Determine the Cursor extensions directory based on OS
function getCursorExtensionsDir() {
  const homedir = os.homedir();
  let extensionsDir;

  switch (process.platform) {
    case 'win32':
      extensionsDir = path.join(homedir, '.cursor', 'extensions');
      break;
    case 'darwin':
      extensionsDir = path.join(homedir, '.cursor', 'extensions');
      break;
    case 'linux':
      extensionsDir = path.join(homedir, '.cursor', 'extensions');
      break;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }

  return extensionsDir;
}

// Create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`${COLORS.yellow}Creating directory: ${dir}${COLORS.reset}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy files from source to destination
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    ensureDirectoryExists(dest);
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(`${COLORS.green}Copied: ${path.basename(src)}${COLORS.reset}`);
  }
}

try {
  // Get extension directory
  const cursorExtDir = getCursorExtensionsDir();
  console.log(`${COLORS.blue}Cursor extensions directory: ${cursorExtDir}${COLORS.reset}`);

  // Define extension installation directory 
  const extensionName = 'cursortools.cursor-prompter-0.2.0';
  const installDir = path.join(cursorExtDir, extensionName);

  // Check if extension is already installed
  if (fs.existsSync(installDir)) {
    console.log(`${COLORS.yellow}Extension already installed at: ${installDir}${COLORS.reset}`);
    console.log(`${COLORS.yellow}Removing old installation...${COLORS.reset}`);
    fs.rmSync(installDir, { recursive: true, force: true });
  }

  // Create extension directory
  ensureDirectoryExists(installDir);

  // Copy files
  const packageDir = path.join(__dirname, 'cursor-prompter-package');
  console.log(`${COLORS.blue}Copying files from: ${packageDir}${COLORS.reset}`);
  
  copyRecursiveSync(path.join(packageDir, 'out'), path.join(installDir, 'out'));
  copyRecursiveSync(path.join(packageDir, 'package.json'), path.join(installDir, 'package.json'));
  copyRecursiveSync(path.join(packageDir, 'README.md'), path.join(installDir, 'README.md'));

  console.log(`\n${COLORS.green}✓ Installation complete!${COLORS.reset}`);
  console.log(`\n${COLORS.cyan}Please restart Cursor to activate the extension.${COLORS.reset}`);
  console.log(`\n${COLORS.magenta}After restart, run "Cursor Prompter: Test Focus Commands" from the Command Palette.${COLORS.reset}`);

} catch (error) {
  console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
  console.log(`\n${COLORS.yellow}Please try manual installation:${COLORS.reset}`);
  console.log(`1. Copy the 'cursor-prompter-package' files to your Cursor extensions directory`);
  console.log(`2. See INSTALLATION.md for detailed instructions`);
  process.exit(1);
} 