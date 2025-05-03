# Cursor Prompter

A simplified, reliable VS Code extension for Cursor IDE that sends timed messages to the AI chat interface.

## Why Cursor Prompter?

- **Keep AI thinking**: Automatically continue conversations with Cursor AI
- **Simple, focused design**: A streamlined tool that does one thing well
- **Reliable message delivery**: Uses the most robust method for interacting with Cursor's chat
- **Sequential prompting**: Cycle through a list of messages for more natural conversations
- **Auto-recovery**: Better error handling and status indication for reliability

## Installation

### Direct Installation (Easiest)

1. **Locate Cursor's Extensions Folder**:
   - Windows: `%USERPROFILE%\.cursor\extensions`
   - macOS: `~/.cursor/extensions`
   - Linux: `~/.cursor/extensions`

2. **Create Extension Folder**:
   - Make a new folder named: `cursortools.cursor-prompter-0.2.0` 

3. **Copy Files**:
   - Copy the following files from this project:
     - `package.json`
     - `out/` folder (contains compiled extension)
     - `README.md`

4. **Restart Cursor** to load the extension

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

## Using Cursor Prompter

The extension is accessible through the command palette (Ctrl+Shift+P or Cmd+Shift+P):

- **Cursor Prompter: Enable** - Turn on automated messaging
- **Cursor Prompter: Disable** - Turn off automated messaging
- **Cursor Prompter: Toggle** - Toggle the extension on/off
- **Cursor Prompter: Send Message Now** - Send a message immediately
- **Cursor Prompter: Open Settings** - Configure the extension
- **Cursor Prompter: Test Focus Commands** - Test which focus commands work with your Cursor version

## Key Settings

Configure these settings in the VS Code settings interface (File > Preferences > Settings):

- `cursorPrompter.enabled`: Enable/disable the automation
- `cursorPrompter.interval`: Time between messages (milliseconds, minimum 5000)
- `cursorPrompter.useMessageSequence`: Use sequence of messages instead of a single message
- `cursorPrompter.messageSequence`: List of messages to cycle through
- `cursorPrompter.message`: Default message (used when not using sequence)
- `cursorPrompter.focusCommand`: The command used to focus Cursor's chat panel
- `cursorPrompter.autoSend`: Automatically press Enter after inserting text
- `cursorPrompter.showNotifications`: Show notifications when messages are sent

## Workflow Best Practices

1. **Start with context**
   - Begin with a manual, detailed prompt that sets the context before enabling the prompter
   - Only enable the prompter after the initial context is established

2. **Use longer intervals**
   - Start with 30+ second intervals
   - Adjust based on Cursor AI's response time and complexity

3. **Combine with manual interaction**
   - The prompter works best as a supplement to manual interaction
   - When AI gives a valuable insight, follow up manually with specific questions

4. **Disable when not needed**
   - Toggle the prompter off when you're not actively using the AI

## Troubleshooting

If the extension doesn't work properly:

1. **Test for compatible focus commands**:
   - Run "Cursor Prompter: Test Focus Commands" from the command palette
   - The extension will test various commands and suggest the best one for your Cursor version

2. **Check the status bar indicator**:
   - If it shows a warning icon (⚠️), the last message attempt failed
   - Hover over the status bar item to see more information

3. **Common fixes**:
   - Ensure Cursor's chat panel is open before enabling the extension
   - Try using the "Send Message Now" command to test functionality
   - If focus doesn't work, use the "Test Focus Commands" feature to find a compatible command
   - Check Cursor's Developer Tools console for extension logs (Help > Toggle Developer Tools)
   - Increase the interval time if messages are being rate-limited 