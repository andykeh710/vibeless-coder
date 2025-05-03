# Cursor Prompter

A lightweight, efficient extension for Cursor IDE that automatically sends follow-up prompts to maintain AI conversations.

![Cursor Prompter Status Bar](https://i.imgur.com/XYZ123.png) *(Status bar preview image)*

## What is Cursor Prompter?

Cursor Prompter keeps your AI conversations flowing by automatically sending follow-up messages at timed intervals. This extension is perfect for developers who want to:

- Extract more insights from the Cursor AI assistant
- Keep the AI generating content while you review or implement suggestions
- Maintain context in long-running conversations
- Get continuous assistance without manual intervention

## Key Features

- **Message Sequencing**: Cycles through customizable prompts for natural conversations
- **Intelligent Error Recovery**: Adapts to focus issues and provides visual feedback
- **Clipboard Preservation**: Safely restores your clipboard content after each operation
- **Compatibility Testing**: Automatically detects which commands work with your Cursor version
- **Visual Status Indicator**: Clear status bar with countdown timer and error state

## Installation

### Option 1: Automatic Installation (Recommended)

If you have Node.js installed, you can use our installation script:

```bash
node install.js
```

This script will:
- Find your Cursor extensions directory
- Create the proper folder structure
- Copy all necessary files
- Provide guidance for next steps

### Option 2: Manual Installation

You can also install Cursor Prompter manually:

1. **Download the package**
   - Get the `cursor-prompter-0.2.0.zip` file from this repository

2. **Extract and install**
   - Extract the ZIP file
   - Find your Cursor extensions folder:
     - Windows: `%USERPROFILE%\.cursor\extensions`
     - macOS: `~/.cursor/extensions`
     - Linux: `~/.cursor/extensions`
   - Create a folder named `cursortools.cursor-prompter-0.2.0`
   - Copy the following files into that folder:
     - `package.json`
     - `out/` directory (with all contents)
     - `README.md`

3. **Restart Cursor**
   - Close and reopen Cursor to load the extension

For detailed installation instructions, refer to the [INSTALLATION.md](cursor-prompter-package/INSTALLATION.md) file.

## Getting Started

After installation, follow these steps:

1. **Run compatibility test**
   - Open Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
   - Select "Cursor Prompter: Test Focus Commands"
   - The extension will detect which commands work with your Cursor version

2. **Configure settings**
   - Open Command Palette
   - Select "Cursor Prompter: Open Settings"
   - Adjust interval (recommended: 30+ seconds)
   - Customize message sequence if desired

3. **Start with context**
   - Open a chat with Cursor AI and establish initial context
   - Manually provide the first prompt to set the direction

4. **Enable the prompter**
   - Open Command Palette
   - Select "Cursor Prompter: Enable"
   - Watch for the status bar indicator to show "Cursor Prompter: ON"

## Recommended Workflow

For the best experience with Cursor Prompter:

1. **Begin with a specific question or task for the AI**
2. **Let the AI respond to your initial question**
3. **Enable Cursor Prompter once context is established**
4. **Monitor and occasionally guide the conversation manually**
5. **Disable when you want to change context completely**

## Command Reference

- `Cursor Prompter: Enable` - Turn on automated messaging
- `Cursor Prompter: Disable` - Turn off automated messaging  
- `Cursor Prompter: Toggle` - Toggle the extension on/off
- `Cursor Prompter: Send Message Now` - Send a message immediately
- `Cursor Prompter: Open Settings` - Configure the extension
- `Cursor Prompter: Test Focus Commands` - Test compatibility with your Cursor version

## Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `cursorPrompter.enabled` | Enable/disable automated messaging | `false` |
| `cursorPrompter.interval` | Time between messages (ms) | `30000` |
| `cursorPrompter.useMessageSequence` | Cycle through message sequence | `true` |
| `cursorPrompter.messageSequence` | Array of messages to cycle through | *[6 default prompts]* |
| `cursorPrompter.focusCommand` | Command to focus chat panel | `"cursor.chatPanel.focus"` |
| `cursorPrompter.autoSend` | Auto-press Enter after message | `true` |
| `cursorPrompter.showNotifications` | Show notification popups | `true` |

## Troubleshooting

If you encounter issues:

1. **Check status indicator**
   - Red alert icon means the last message failed
   - Hover to see more details

2. **Run compatibility test**
   - Use "Test Focus Commands" to find working commands
   - Allow it to update your settings if prompted

3. **Check Developer Tools**
   - Open Help > Toggle Developer Tools
   - See console logs for detailed error information

For more troubleshooting steps, refer to the extension's in-package documentation.

## How It Works

The extension uses a systematic approach to interact with Cursor's chat interface:

1. **Focus Phase**: Uses compatible commands to focus the chat panel
2. **Clipboard Phase**: Temporarily uses clipboard to insert messages reliably
3. **Send Phase**: Simulates Enter key press to send messages
4. **Recovery Phase**: Restores original clipboard content

This method provides maximum compatibility across different Cursor versions.

## Project Structure

```
cursor-prompter/
├── src/                    # TypeScript source code
│   └── extension.ts        # Main extension code
├── out/                    # Compiled JavaScript output
├── package.json            # Extension manifest
├── README.md               # This file
├── INSTALLATION.md         # Detailed installation guide
├── install.js              # Automatic installation script 
└── tsconfig.json           # TypeScript configuration
```

## Development

To build from source:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Make changes to `src/extension.ts`
4. Run `npm run compile` to compile TypeScript to JavaScript
5. Follow installation steps using your compiled files

## License

This project is released under the MIT License. See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Cursor community
- Inspired by the need for continuous AI assistance without manual prompting
- Special thanks to all contributors and testers 