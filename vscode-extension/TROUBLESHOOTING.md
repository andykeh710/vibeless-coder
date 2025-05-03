# Cursor Prompter - Troubleshooting Guide

This guide helps solve common issues with the Cursor Prompter extension.

## Quick Start Troubleshooting

If you're experiencing issues, run these diagnostic steps first:

1. **Run the Focus Command Test**:
   - Open the command palette (Ctrl+Shift+P or Cmd+Shift+P)
   - Type and select "Cursor Prompter: Test Focus Commands"
   - The extension will test all available focus commands and suggest the best one
   - If prompted to change to a working command, select "Yes"

2. **Check for error indicators**:
   - Look at the status bar indicator - if it shows an alert icon (⚠️), there's an issue
   - Hover over the status bar item to see error details

3. **Try a manual send**:
   - Run "Cursor Prompter: Send Message Now" from the command palette
   - Watch for any error messages or notifications

## Common Issues and Solutions

### Extension Not Working

#### Issue: Messages not being sent at all

**Possible causes and solutions:**

1. **Chat panel not focused**
   - Make sure the Cursor chat panel is open and visible
   - Click in the chat input area once manually before enabling the extension
   - Run the "Test Focus Commands" feature to find compatible commands for your Cursor version

2. **Focus command not working**
   - Run "Cursor Prompter: Test Focus Commands" from the command palette
   - The extension will automatically detect which commands work with your Cursor version
   - If prompted, allow the extension to update your focus command setting

3. **Extension not enabled**
   - Check the status bar indicator shows "Cursor Prompter: ON"
   - Run "Cursor Prompter: Enable" from command palette

#### Issue: Messages inserted but not sent

**Possible causes and solutions:**

1. **Auto-send not working**
   - Turn off `cursorPrompter.autoSend` in settings and press Enter manually
   - Cursor may be blocking programmatic Enter key simulation

2. **Rate limiting by Cursor**
   - Increase the interval between messages (recommend 30+ seconds)
   - Try restarting Cursor
   - Look for error logs in the Developer Tools console

3. **Clipboard permission issues**
   - The extension uses clipboard to paste messages reliably
   - Make sure Cursor has permission to access the clipboard
   - Watch the Developer Tools console for clipboard-related errors

### Visual Indicators

The extension now provides visual indicators in the status bar to help diagnose issues:

1. **Normal operation**: Shows a comment icon (💬) with "Cursor Prompter: ON"
2. **Error state**: Shows an alert icon (⚠️) with "Cursor Prompter: ON" and red background
3. **Tooltip information**: Hover over the status bar item to see countdown and error details

### Installation Issues

#### Issue: Extension doesn't appear in Cursor

**Possible causes and solutions:**

1. **Wrong extension folder name**
   - Make sure the folder is named exactly: `cursortools.cursor-prompter-0.2.0`

2. **Incorrect file structure**
   - Ensure the extension folder contains:
     - `package.json`
     - `out/extension.js` (compiled JavaScript)
     - `README.md`

3. **Cursor needs restart**
   - Close Cursor completely and reopen it

### Debugging Tools

To get more information about what's happening:

1. **Enable Developer Tools**
   - In Cursor, go to Help → Toggle Developer Tools
   - Click on the Console tab
   - Look for messages starting with "Cursor Prompter"

2. **Check extension activation**
   - When Cursor starts, you should see "Cursor Prompter extension is now active" in the console
   - If you don't see this message, the extension isn't loading correctly

3. **Test focus compatibility**
   - The "Test Focus Commands" feature will print all test results to the console
   - Review this output to understand which commands work with your version of Cursor

## Step-by-Step Diagnosis

If you're experiencing issues, follow these steps to diagnose the problem:

1. **Test focus commands**
   - Run "Cursor Prompter: Test Focus Commands" 
   - Follow any suggestions to update your configuration

2. **Check extension loading**
   - Open Developer Tools console (Help → Toggle Developer Tools)
   - Restart Cursor and look for "Cursor Prompter extension is now active"

3. **Test basic functionality**
   - Run "Cursor Prompter: Send Message Now" command
   - Watch the console logs to see what steps succeed/fail

4. **Isolate the issue**
   - If the message is pasted but not sent → Auto-send issue
   - If nothing happens → Focus or extension loading issue
   - If error appears in console → Check the specific error message

5. **Verify settings**
   - Run "Cursor Prompter: Open Settings" and check your configuration

## New Error Recovery Features

The extension now includes several error recovery mechanisms:

1. **Auto-retry focus commands**:
   - If the configured focus command fails, the extension tries alternative commands
   - The status bar shows an alert when focus fails

2. **Clipboard protection**:
   - Improved clipboard handling to preserve your original clipboard content
   - More reliable clipboard restoration if an error occurs

3. **Visual feedback**:
   - Status bar changes color when errors occur
   - Hover tooltips show specific error information

## Cursor Version Compatibility

- **Cursor 0.5.x - 0.9.x**: May have different chat panel implementation
- **Cursor 0.10.x+**: Should work with current extension version
- **Latest Cursor**: Use the "Test Focus Commands" feature to ensure compatibility

If your Cursor version is very new or old, run the "Test Focus Commands" feature to find compatible focus commands.

## Getting Help

If you're still experiencing issues:

1. **Run the command diagnostics**: "Cursor Prompter: Test Focus Commands"
2. **Check the logs** in Developer Tools console
3. **Try a clean installation** of the extension
4. **Report the issue** with:
   - Your Cursor version
   - Your operating system
   - Complete console logs
   - Steps to reproduce the issue
   - Description of what happens vs. what you expect