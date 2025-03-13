# Cursor Automation Extension

A VS Code extension specifically designed for [Cursor](https://cursor.sh), the AI-powered code editor built on VS Code. This extension automates sending messages to Cursor's AI agent at configurable intervals.

## Features

- **Timer-Based Automation**: Automatically insert messages at regular intervals
- **Cursor Integration**: Works specifically with Cursor's AI agent system
- **Customizable Messaging**: Configure your message content, timing, and behavior
- **Multi-Cursor Support**: Works with single or multiple cursor positions
- **Visual Feedback**: Status bar indicator with countdown timer
- **Notifications**: Optional notifications when messages are sent

## Requirements

- [Cursor Editor](https://cursor.sh) (built on VS Code)
- Compatible with Cursor version 0.9.0 and above

## Extension Settings

This extension contributes the following settings:

* `cursorAutomation.enabled`: Enable or disable automatic message sending
* `cursorAutomation.interval`: Interval in milliseconds between automated messages (minimum: 1000ms)
* `cursorAutomation.message`: Message to send to Cursor AI agent
* `cursorAutomation.autoSend`: Automatically trigger Cursor's send command after inserting message
* `cursorAutomation.handleMultiCursor`: Insert message at all cursor positions when multiple cursors are active
* `cursorAutomation.cursorBehavior`: Where to place the cursor after inserting a message (stay/end/start)
* `cursorAutomation.showNotifications`: Show notifications when messages are sent
* `cursorAutomation.playSound`: Play a sound when messages are sent

## Commands

This extension provides the following commands:

* `cursor-automation.enable`: Enable automated messaging
* `cursor-automation.disable`: Disable automated messaging
* `cursor-automation.sendNow`: Send a message right now
* `cursor-automation.openSettings`: Open the extension settings

## Known Issues and Limitations

- This extension is specifically designed for Cursor editor and may not work in standard VS Code
- The "auto-send" feature depends on Cursor's internal commands which may change between versions
- For optimal compatibility, please update to the latest version of Cursor

## Release Notes

### 0.1.0

Initial release:
- Timer-based message insertion
- Customizable settings
- Status bar integration
- Multi-cursor support

## How It Works

This extension integrates with Cursor by:

1. Inserting the specified message at the current cursor position(s)
2. Optionally invoking Cursor's AI agent send command
3. Managing a timer to repeat this action at the specified interval
4. Providing visual feedback through the status bar

## Troubleshooting

If the extension doesn't work as expected:

1. Ensure you're running in Cursor editor, not standard VS Code
2. Check that the extension is enabled in Cursor's extension manager
3. Try adjusting the interval setting (some versions of Cursor may have rate limits)
4. Make sure your Cursor installation is up to date

## Privacy

This extension:
- Does not collect or transmit any data
- Does not modify your code outside of explicit user-configured actions
- Operates entirely within your local Cursor environment

## License

MIT

## For Developers

If you want to modify or extend this extension:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Make your changes to the TypeScript files
4. Run `npm run compile` to build the extension
5. Press F5 in VS Code to launch a new window with the extension loaded
6. Test your changes

See VS Code's [extension development](https://code.visualstudio.com/api) documentation for more information.