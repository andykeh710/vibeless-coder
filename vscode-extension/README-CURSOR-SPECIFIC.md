# Cursor Chat Automation Extension

## What This Extension Does

This extension automates interactions with Cursor's chat interface by:

1. Sending pre-configured messages at timed intervals
2. Maintaining an ongoing conversation with Cursor AI
3. Allowing customizable message content and timing

## Installation Options for Cursor

### Option 1: Direct Installation (Easiest)

1. **Locate Cursor's Extensions Folder**:
   - Windows: `%USERPROFILE%\.cursor\extensions`
   - macOS: `~/.cursor/extensions`
   - Linux: `~/.cursor/extensions`

2. **Create Extension Folder**:
   - Make a new folder named: `mr-janders.cursor-chat-automation-0.1.0` 

3. **Copy These Files**:
   - From this project's `vscode-extension` folder, copy:
     - `package.json`
     - `out/` folder (contains compiled JS files)
     - `README.md`

4. **Restart Cursor** to load the extension

### Option 2: Manual Compilation

If you prefer to compile the extension yourself:

1. Install Node.js if you don't have it already
2. Open a terminal in the `vscode-extension` folder
3. Run:
   ```
   npm install
   npm run compile
   ```
4. Follow steps 1-4 from Option 1, using your compiled files

## Using the Extension

After installation:

1. Open Cursor
2. Open Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type "Cursor Chat Automation" to see available commands:
   - `Cursor Chat Automation: Enable` - Turn on automated messaging
   - `Cursor Chat Automation: Disable` - Turn off automated messaging
   - `Cursor Chat Automation: Send Message Now` - Send a message immediately
   - `Cursor Chat Automation: Open Settings` - Configure the extension

## Key Settings

Configure these settings in Cursor's Settings (Command Palette → "Preferences: Open Settings"):

- `cursorAutomation.enabled`: Enable/disable the automation
- `cursorAutomation.interval`: Time between messages (milliseconds, minimum 5000)
- `cursorAutomation.message`: Default message to send
- `cursorAutomation.showNotifications`: Show notifications when messages are sent
- `cursorAutomation.autoSend`: Automatically press Enter after inserting text

## Important Tips for Cursor Users

- **Focus First**: Always click in the chat input area before enabling automation
- **Start Small**: Begin with longer intervals (30+ seconds) to avoid rate limits
- **Check Console**: If things aren't working, open Developer Tools (Help → Toggle Developer Tools) to see logs
- **Cursor Versions**: Commands may vary slightly between Cursor versions
- **Status Bar**: Look for the "Cursor Automation" indicator in the status bar
- **Manual Send**: If automatic sending doesn't work, disable autoSend and press Enter manually

## Troubleshooting in Cursor

If the extension doesn't work properly:

1. Make sure Cursor's chat panel is open and visible
2. Click in the chat input area to ensure it has focus
3. Try running "Send Message Now" command to test functionality
4. Check Developer Tools console for any error messages
5. Verify the extension appears in Cursor's extensions list
6. Try increasing the interval time if messages are being rate-limited

## Debug Logging

The extension logs detailed information to the Developer Tools console. To view:

1. In Cursor, go to Help → Toggle Developer Tools
2. Click on the Console tab
3. Look for messages starting with "Cursor Automation extension"
4. These logs will help identify where any issues might be occurring

## Need More Help?

See the following files for additional assistance:
- `CURSOR_INSTALLATION.md` - Detailed installation instructions
- `TROUBLESHOOTING.md` - Solutions for common issues