# Cursor Prompter Installation Guide

This guide will help you install the Cursor Prompter extension directly in your Cursor IDE.

## Automatic Installation (Recommended)

The easiest way to install Cursor Prompter is using our installation script:

1. **Download the package**
   - Download the full package including the installation script

2. **Run the installer**
   - Open a terminal in the downloaded directory
   - Run: `node install.js`
   - Follow the on-screen prompts
   - The script will detect your Cursor installation and install the extension

3. **Restart Cursor**
   - Close and reopen Cursor to load the extension

## Manual Installation Steps

If the automatic installation doesn't work for any reason, you can install manually:

1. **Locate Cursor's extensions folder**
   - **Windows**: `%USERPROFILE%\.cursor\extensions`
   - **macOS**: `~/.cursor/extensions`
   - **Linux**: `~/.cursor/extensions`

   > **Tip**: If you can't find the folder, open Cursor, go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X), right-click on any installed extension and select "Show Local Folder"

2. **Create folder for the extension**
   - Create a new folder in the extensions directory named:
     ```
     cursortools.cursor-prompter-0.2.0
     ```
   - The format is important: `[publisher].[name]-[version]`

3. **Copy extension files**
   - Copy the following files from the package into the newly created extension folder:
     - `package.json`
     - `out/` folder (entire folder with contents)
     - `README.md`

4. **Verify the structure**
   - Your final directory structure should look like:
     ```
     cursortools.cursor-prompter-0.2.0/
     ├── package.json
     ├── README.md
     └── out/
         ├── extension.js
         └── [other compiled files]
     ```

5. **Restart Cursor IDE**
   - Close and reopen Cursor to load the extension

## Verifying Installation

1. After restarting Cursor, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "Cursor Prompter" and you should see the extension commands listed
3. Look for "Cursor Prompter: Test Focus Commands" - run this to test compatibility
4. Check the status bar for the Cursor Prompter indicator

## Troubleshooting Installation Issues

If you encounter installation problems:

### Extension Not Appearing

1. **Check the folder name**
   - Make sure it's exactly: `cursortools.cursor-prompter-0.2.0`
   - Check for any typos or extra spaces

2. **Check file permissions**
   - Ensure all files have appropriate read permissions
   - On Unix systems: `chmod -R 644 cursortools.cursor-prompter-0.2.0`

3. **Check Cursor's log**
   - Open Cursor's Developer Tools (Help > Toggle Developer Tools)
   - Check for any errors related to extension loading

### Permission Issues

1. **Windows**
   - Run Cursor as Administrator when first installing the extension
   - Try installing manually with Administrator privileges

2. **macOS/Linux**
   - Check ownership of the `.cursor` directory: `ls -la ~/`
   - If needed, fix permissions: `sudo chown -R $(whoami) ~/.cursor`

## Updating from a Previous Version

If you're updating from a previous version:

1. **Remove the old version**
   - Delete the previous extension folder (e.g., `cursortools.cursor-prompter-0.1.0`)
   - Or use the automatic installer which will detect and replace the existing version

2. **Install the new version**
   - Follow the installation steps above for the new version

3. **Reset your settings if needed**
   - If you experience issues, try resetting the extension settings
   - Run "Cursor Prompter: Test Focus Commands" to reconfigure compatibility

## Getting Started After Installation

Once installed, follow these steps to get started:

1. Run "Cursor Prompter: Test Focus Commands" to detect compatible commands
2. Configure your preferred settings through "Cursor Prompter: Open Settings"
3. Enable the prompter when you're ready to use it

Refer to the README.md for detailed usage instructions 