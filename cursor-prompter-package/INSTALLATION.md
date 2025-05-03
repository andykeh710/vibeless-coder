# Cursor Prompter Installation Guide

This guide will help you install the Cursor Prompter extension directly in your Cursor IDE.

## Step-by-Step Installation

### Method 1: Direct Installation from This Package

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
   - Copy the following files from this package into the newly created extension folder:
     - `package.json`
     - `out/` folder (entire folder with contents)
     - `README.md`

4. **Restart Cursor IDE**
   - Close and reopen Cursor to load the extension

## Verifying Installation

1. After restarting Cursor, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "Cursor Prompter" and you should see the extension commands listed
3. Look for "Cursor Prompter: Test Focus Commands" - this is a diagnostic feature
4. Check the status bar for the Cursor Prompter indicator

## First Steps After Installation

1. **Test focus commands compatibility**
   - Run the command "Cursor Prompter: Test Focus Commands"
   - This will test which commands work with your version of Cursor
   - If prompted to update your focus command setting, select "Yes"

2. **Configure settings**
   - Run "Cursor Prompter: Open Settings"
   - Adjust the interval (recommended: 30000 ms or higher)
   - Review the message sequence settings
   - Leave other settings at their defaults initially

3. **Test manually**
   - Make sure Cursor's chat panel is open
   - Run "Cursor Prompter: Send Message Now" to test
   - Verify the message appears in the chat panel and is sent

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