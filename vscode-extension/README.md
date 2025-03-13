# Cursor Chat Automation Extension

A VS Code extension specifically designed for [Cursor](https://cursor.sh), the AI-powered code editor built on VS Code. This extension automates sending messages to Cursor's chat interface at configurable intervals to keep conversations going without manual intervention.

## Features

- **Timer-Based Automation**: Automatically send messages to Cursor's AI chat at regular intervals
- **Cursor Chat Integration**: Works specifically with Cursor's right-hand chat panel
- **Customizable Messaging**: Configure message content, timing, and sending behavior
- **Message Templates**: Includes default follow-up message templates to use
- **Visual Feedback**: Status bar indicator with countdown timer
- **Notifications**: Optional notifications when messages are sent

## Requirements

- [Cursor Editor](https://cursor.sh) (built on VS Code)
- Compatible with Cursor version 0.9.0 and above

## Extension Settings

This extension contributes the following settings:

* `cursorAutomation.enabled`: Enable or disable automatic message sending to Cursor's chat
* `cursorAutomation.interval`: Interval in milliseconds between automated messages (minimum: 5000ms recommended)
* `cursorAutomation.message`: Message to send to Cursor AI chat
* `cursorAutomation.autoSend`: Automatically press Enter to send the message after inserting it
* `cursorAutomation.showNotifications`: Show notifications when messages are sent
* `cursorAutomation.playSound`: Play a sound when messages are sent
* `cursorAutomation.messageTemplates`: List of message templates that can be selected (future feature)

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

This extension integrates with Cursor's chat interface by:

1. Attempting to focus on Cursor's chat panel (right side of the IDE)
2. Inserting your configured message into the chat input box
3. Optionally sending the message by simulating Enter key press
4. Managing a timer to repeat this action at the specified interval
5. Providing visual feedback through the status bar with countdown

The extension uses multiple techniques to interact with Cursor's chat:
- Attempts to use Cursor's internal commands
- Uses clipboard-based input as a fallback
- Simulates keyboard input when needed

This multi-pronged approach ensures maximum compatibility with different versions of Cursor.

## Troubleshooting

If the extension doesn't work as expected:

1. Ensure you're running in Cursor editor, not standard VS Code
2. Check that the extension is enabled in Cursor's extension manager
3. Try manually opening the Cursor chat panel first (extension may not be able to open it automatically)
4. Click once in the chat input area before enabling automation (to ensure focus)
5. Try extending the interval time (Cursor may have rate limits on messages)
6. Restart Cursor if the chat interface becomes unresponsive
7. Make sure your Cursor installation is up to date

Common issues:
- **Messages not appearing in chat**: Try clicking the chat input box first to ensure focus
- **Messages appear but don't send**: The Enter simulation might not be working; try disabling autoSend and manually press Enter
- **Extension commands not found**: Ensure the extension is properly installed and activated
- **Rate limiting**: If Cursor stops responding to inputs, you may be sending too many messages; increase the interval

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