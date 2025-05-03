# Cursor Chat Automation - Installation Guide

This guide provides step-by-step instructions for installing the Cursor Chat Automation extension directly into Cursor IDE without using the VS Code Extension Marketplace.

## Manual Installation (Recommended Method)

### Step 1: Locate Cursor's extensions folder
Cursor stores extensions in a specific directory based on your operating system:

- **Windows**: `%USERPROFILE%\.cursor\extensions`
- **macOS**: `~/.cursor/extensions`
- **Linux**: `~/.cursor/extensions`

You can open this folder by:
1. Opening Cursor
2. Going to Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
3. Right-clicking on any installed extension and selecting "Show Local Folder"
4. Navigate up one directory level to see the extensions folder

### Step 2: Create folder for the extension
1. Create a new folder in the extensions directory with this specific name format:
   ```
   mr-janders.cursor-chat-automation-0.1.0
   ```
   
   The format is: `[publisher-name].[extension-name]-[version]`

### Step 3: Compile the extension
1. Make sure you have Node.js installed on your system
2. Open a terminal in the `vscode-extension` directory of this project
3. Run the following commands:
   ```
   npm install
   npm run compile
   ```
   
   This creates a compiled version of the extension in the `out` folder

### Step 4: Copy necessary files
Copy these files/folders from the `vscode-extension` directory to your newly created extension folder:
- `package.json`
- `out/` (entire folder, contains compiled JavaScript)
- `node_modules/` (if you want to avoid installing dependencies in Cursor)
- `README.md`
- `CHANGELOG.md` (if present)

### Step 5: Restart Cursor
Close and reopen Cursor to load the extension.

## Testing the Extension

After installation:

1. Open Cursor
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type "Cursor Chat Automation" to see available commands
4. Start with "Cursor Chat Automation: Open Settings" to configure settings
5. Make sure Cursor's chat panel is open (right side of the interface)
6. Click in the chat input area once (important for focus)
7. Use "Cursor Chat Automation: Enable" to start the automation

## Debugging Tips

If the extension isn't working properly:

1. **Enable Developer Tools** in Cursor (Help > Toggle Developer Tools)
2. Check the Console tab for any error messages
3. Look for logs from the extension (they start with "Cursor Automation extension...")
4. Try manually triggering the extension using "Cursor Chat Automation: Send Message Now"
5. Ensure the chat panel is properly focused before enabling

## Common Installation Issues

- **Extension not appearing in Command Palette**: 
  - Check that you used the correct folder name format
  - Verify that package.json was copied correctly
  - Make sure the out/ folder contains compiled JavaScript files

- **Compilation errors during npm run compile**:
  - Try running `npm install typescript @types/node @types/vscode` first
  - Check your Node.js version (v14+ recommended)

- **Permission issues**:
  - Ensure you have write access to the extensions folder
  - On macOS/Linux, you might need `sudo` for system directories

## Uninstalling

To remove the extension:
1. Delete the folder you created in Cursor's extensions directory
2. Restart Cursor

## Additional Support

If you encounter persistent issues:
1. Check if Cursor provides extension development documentation
2. Look for specific documentation on Cursor's chat API
3. Try running the extension in VS Code first to test functionality

Remember that Cursor's internal APIs may change between versions, which could affect the extension's functionality.