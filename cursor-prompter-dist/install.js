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
  bold: '\x1b[1m'
};

console.log(`${COLORS.cyan}${COLORS.bold}
========================================
  Cursor Prompter Installation Helper
========================================
${COLORS.reset}`);

// Version info
const EXTENSION_VERSION = '0.2.0';
const EXTENSION_NAME = 'cursor-prompter';
const EXTENSION_PUBLISHER = 'cursortools';
const FULL_EXTENSION_ID = `${EXTENSION_PUBLISHER}.${EXTENSION_NAME}-${EXTENSION_VERSION}`;

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

// Check for Cursor installation
function checkCursorInstallation(extensionsDir) {
  if (!fs.existsSync(path.dirname(extensionsDir))) {
    console.log(`${COLORS.yellow}Warning: Cursor installation directory not found at expected location${COLORS.reset}`);
    console.log(`Expected: ${path.dirname(extensionsDir)}`);
    console.log(`This could mean:`);
    console.log(`  - Cursor is not installed`);
    console.log(`  - Cursor is installed in a non-standard location`);
    console.log(`  - You're using a newer version with a different directory structure`);
    
    const proceed = promptYesNo('Continue with installation anyway?');
    if (!proceed) {
      console.log(`${COLORS.yellow}Installation aborted${COLORS.reset}`);
      process.exit(0);
    }
  } else {
    console.log(`${COLORS.green}✓ Cursor installation found${COLORS.reset}`);
  }
}

// Create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`${COLORS.yellow}Creating directory: ${dir}${COLORS.reset}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
      console.error(`${COLORS.red}Failed to create directory: ${error.message}${COLORS.reset}`);
      throw error;
    }
  }
}

// Copy files from source to destination with progress tracking
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    ensureDirectoryExists(dest);
    const files = fs.readdirSync(src);
    
    console.log(`${COLORS.blue}Copying directory: ${path.basename(src)} (${files.length} items)${COLORS.reset}`);
    
    files.forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    try {
      fs.copyFileSync(src, dest);
      console.log(`${COLORS.green}Copied: ${path.basename(src)}${COLORS.reset}`);
    } catch (error) {
      console.error(`${COLORS.red}Error copying ${src}: ${error.message}${COLORS.reset}`);
      throw error;
    }
  }
}

// Simple Yes/No prompt
function promptYesNo(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(`${question} (y/N): `, answer => {
      readline.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Check if path is writable
async function checkWritePermission(dir) {
  try {
    const testFile = path.join(dir, '.permission_test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`${COLORS.green}✓ Write permission confirmed${COLORS.reset}`);
    return true;
  } catch (error) {
    console.log(`${COLORS.red}✗ No write permission for ${dir}${COLORS.reset}`);
    console.log(`${COLORS.yellow}This could be due to insufficient permissions${COLORS.reset}`);
    
    if (process.platform !== 'win32') {
      console.log(`${COLORS.yellow}You might need to run with sudo${COLORS.reset}`);
    } else {
      console.log(`${COLORS.yellow}Try running as administrator${COLORS.reset}`);
    }
    
    const proceed = await promptYesNo('Try installation anyway?');
    if (!proceed) {
      console.log(`${COLORS.yellow}Installation aborted${COLORS.reset}`);
      process.exit(0);
    }
    return false;
  }
}

// Validate extension files
function validateExtensionFiles(packageDir) {
  const requiredFiles = [
    'package.json',
    'out/extension.js'
  ];
  
  console.log(`${COLORS.blue}Validating extension files...${COLORS.reset}`);
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(packageDir, file))
  );
  
  if (missingFiles.length > 0) {
    console.log(`${COLORS.red}Missing required files:${COLORS.reset}`);
    missingFiles.forEach(file => console.log(`  - ${file}`));
    
    throw new Error('Extension package is incomplete');
  }
  
  console.log(`${COLORS.green}✓ All required files present${COLORS.reset}`);
  return true;
}

// Main installation function
async function installExtension() {
  try {
    // Get extension directory
    const cursorExtDir = getCursorExtensionsDir();
    console.log(`${COLORS.blue}Cursor extensions directory: ${cursorExtDir}${COLORS.reset}`);
    
    // Check if Cursor is installed
    checkCursorInstallation(cursorExtDir);
    
    // Create directory if needed
    ensureDirectoryExists(cursorExtDir);
    
    // Check write permissions
    await checkWritePermission(cursorExtDir);

    // Define extension installation directory 
    const installDir = path.join(cursorExtDir, FULL_EXTENSION_ID);

    // Check if extension is already installed
    if (fs.existsSync(installDir)) {
      console.log(`${COLORS.yellow}Extension already installed at: ${installDir}${COLORS.reset}`);
      const shouldReplace = await promptYesNo('Replace existing installation?');
      
      if (shouldReplace) {
        console.log(`${COLORS.yellow}Removing old installation...${COLORS.reset}`);
        try {
          fs.rmSync(installDir, { recursive: true, force: true });
        } catch (error) {
          console.error(`${COLORS.red}Failed to remove existing installation: ${error.message}${COLORS.reset}`);
          throw error;
        }
      } else {
        console.log(`${COLORS.yellow}Installation aborted${COLORS.reset}`);
        return;
      }
    }

    // Create extension directory
    ensureDirectoryExists(installDir);

    // Locate package directory
    const packageDir = path.join(__dirname, 'cursor-prompter-package');
    
    if (!fs.existsSync(packageDir)) {
      console.log(`${COLORS.yellow}Package directory not found at: ${packageDir}${COLORS.reset}`);
      console.log(`Looking for alternative locations...`);
      
      // Try to find it in current directory or parent
      const altLocations = [
        path.join(__dirname, 'cursor-prompter'),
        path.join(__dirname, '..', 'cursor-prompter-package'),
        path.join(__dirname, '..', 'cursor-prompter')
      ];
      
      let found = false;
      for (const loc of altLocations) {
        if (fs.existsSync(loc)) {
          console.log(`${COLORS.green}Found package at: ${loc}${COLORS.reset}`);
          validateExtensionFiles(loc);
          copyRecursiveSync(path.join(loc, 'out'), path.join(installDir, 'out'));
          copyRecursiveSync(path.join(loc, 'package.json'), path.join(installDir, 'package.json'));
          copyRecursiveSync(path.join(loc, 'README.md'), path.join(installDir, 'README.md'));
          found = true;
          break;
        }
      }
      
      if (!found) {
        throw new Error(`Could not locate extension package files`);
      }
    } else {
      console.log(`${COLORS.blue}Found package directory: ${packageDir}${COLORS.reset}`);
      validateExtensionFiles(packageDir);
      
      // Copy files
      copyRecursiveSync(path.join(packageDir, 'out'), path.join(installDir, 'out'));
      copyRecursiveSync(path.join(packageDir, 'package.json'), path.join(installDir, 'package.json'));
      copyRecursiveSync(path.join(packageDir, 'README.md'), path.join(installDir, 'README.md'));
    }

    console.log(`\n${COLORS.green}${COLORS.bold}✓ Installation complete!${COLORS.reset}`);
    console.log(`\n${COLORS.cyan}Please restart Cursor to activate the extension.${COLORS.reset}`);
    console.log(`\n${COLORS.magenta}After restart, run "Cursor Prompter: Test Focus Commands" from the Command Palette.${COLORS.reset}`);
    console.log(`\n${COLORS.blue}If you have any issues, check the README.md for troubleshooting steps.${COLORS.reset}`);

  } catch (error) {
    console.error(`\n${COLORS.red}${COLORS.bold}Error: ${error.message}${COLORS.reset}`);
    console.log(`\n${COLORS.yellow}Please try manual installation:${COLORS.reset}`);
    console.log(`1. Create folder: ${getCursorExtensionsDir()}/${FULL_EXTENSION_ID}`);
    console.log(`2. Copy the following files from 'cursor-prompter-package' to that folder:`);
    console.log(`   - package.json`);
    console.log(`   - out/ directory (with all contents)`);
    console.log(`   - README.md`);
    console.log(`3. Restart Cursor`);
    process.exit(1);
  }
}

// Run the installation
installExtension(); 