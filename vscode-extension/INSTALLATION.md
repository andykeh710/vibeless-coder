# Cursor Prompter Installation Guide

This guide will help you install the Cursor Prompter extension directly in your Cursor IDE.

## Step-by-Step Installation

### Method 1: Direct Installation

1. **Download the extension**
   - Download the `cursor-prompter-0.2.0.zip` file from the releases
   - Extract the zip file to a temporary location

2. **Locate Cursor's extensions folder**
   - **Windows**: `%USERPROFILE%\.cursor\extensions`
   - **macOS**: `~/.cursor/extensions`
   - **Linux**: `~/.cursor/extensions`

   > **Tip**: If you can't find the folder, open Cursor, go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X), right-click on any installed extension and select "Show Local Folder"

3. **Create folder for the extension**
   - Create a new folder in the extensions directory named:
     ```
     cursortools.cursor-prompter-0.2.0
     ```

4. **Copy extension files**
   - Copy the following files from the extracted folder into the newly created extension folder:
     - `package.json`
     - `out/` folder (entire folder with contents)
     - `README.md`

5. **Restart Cursor IDE**
   - Close and reopen Cursor to load the extension

### Method 2: Compilation from Source

If you prefer to compile the extension yourself:

1. **Clone or download the repository**
   - Make sure you have Git and Node.js installed

2. **Install dependencies and compile**
   - Open a terminal in the extension directory
   - Run:
     ```
     npm install
     npm run compile
     ```
   - This creates a compiled version in the `out` folder

3. **Follow steps 2-5 from Method 1**
   - Using your compiled files instead

## First-Time Setup

After installation, you should run through these setup steps:

1. **Verify installation**
   - After restarting Cursor, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
   - Type "Cursor Prompter" and verify you see the extension commands

2. **Test focus commands compatibility**
   - Run the command "Cursor Prompter: Test Focus Commands"
   - This will test which commands work with your version of Cursor
   - If prompted to update your focus command setting, select "Yes"

3. **Configure settings**
   - Run "Cursor Prompter: Open Settings"
   - Adjust the interval (recommended: 30000 ms or higher)
   - Review the message sequence settings
   - Leave other settings at their defaults initially

4. **Test manually**
   - Make sure Cursor's chat panel is open
   - Run "Cursor Prompter: Send Message Now" to test
   - Verify the message appears in the chat panel and is sent

5. **Enable the prompter**
   - Run "Cursor Prompter: Enable" to start automated prompting
   - Check the status bar for the "Cursor Prompter: ON" indicator

## Verifying Installation

1. After restarting Cursor, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "Cursor Prompter" and you should see the extension commands listed
3. Look for "Cursor Prompter: Test Focus Commands" - this is a new diagnostic feature
4. Check the status bar for the Cursor Prompter indicator

## Status Bar Indicator

The extension adds a status bar indicator that shows:
- Current status (ON/OFF)
- Error state (alert icon if there are issues)
- Countdown to next message (visible when hovering)

You can click this indicator to toggle the extension on/off.

## Troubleshooting

If the extension doesn't appear after installation:

1. **Check the extension folder name**
   - Make sure it follows the format: `cursortools.cursor-prompter-0.2.0`

2. **Verify file structure**
   - The extension folder should contain:
     - `package.json`
     - `out/extension.js` (and other compiled files)
     - `README.md`

3. **Check Cursor's Developer Tools**
   - Open Developer Tools in Cursor (Help > Toggle Developer Tools)
   - Look for any errors related to the extension loading

4. **Test focus commands**
   - If chat panel focus doesn't work, run "Cursor Prompter: Test Focus Commands"
   - The extension will identify which commands work on your system

## Common Issues

- **Extension not showing up**: Make sure you've restarted Cursor after installation
- **"Cannot find module" errors**: Ensure all files were copied correctly to the extensions folder
- **Commands not working**: Use the "Test Focus Commands" feature to find compatible commands
- **Clipboard errors**: Make sure Cursor has permission to access your clipboard

## Getting Updates

When a new version is released:

1. Download the new version
2. Remove the old extension folder
3. Follow the installation steps for the new version
4. Restart Cursor
5. Run "Cursor Prompter: Test Focus Commands" to ensure compatibility 