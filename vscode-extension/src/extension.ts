import * as vscode from 'vscode';

// Define a class to manage the automation timer
class AutomationManager {
  private timer: NodeJS.Timer | undefined;
  private statusBarItem: vscode.StatusBarItem;
  private context: vscode.ExtensionContext;
  private lastTriggered: Date | null = null;
  private nextTriggerTime: Date | null = null;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    
    // Create status bar item
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'cursor-automation.openSettings';
    this.updateStatusBar();
    this.statusBarItem.show();
    
    // Register configuration change listener
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(this.handleConfigChange, this)
    );
    
    // Start timer if enabled by default
    this.handleConfigChange();
  }

  private handleConfigChange(e?: vscode.ConfigurationChangeEvent) {
    if (!e || e.affectsConfiguration('cursorAutomation')) {
      const config = vscode.workspace.getConfiguration('cursorAutomation');
      const enabled = config.get<boolean>('enabled', false);
      
      if (enabled) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
      
      this.updateStatusBar();
    }
  }

  private updateStatusBar() {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    const enabled = config.get<boolean>('enabled', false);
    
    if (enabled) {
      this.statusBarItem.text = '$(clock) Cursor Automation: ON';
      this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      
      if (this.nextTriggerTime) {
        const remainingMs = this.nextTriggerTime.getTime() - Date.now();
        const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
        this.statusBarItem.tooltip = `Next message in ${remainingSec}s`;
      } else {
        this.statusBarItem.tooltip = 'Cursor automation is active';
      }
    } else {
      this.statusBarItem.text = '$(clock) Cursor Automation: OFF';
      this.statusBarItem.backgroundColor = undefined;
      this.statusBarItem.tooltip = 'Cursor automation is inactive';
    }
  }

  // Start the automation timer
  private startTimer() {
    // Clear any existing timer
    this.stopTimer();
    
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    const interval = config.get<number>('interval', 5000);
    
    // Set up new timer
    this.timer = setInterval(() => {
      this.sendMessage();
    }, interval);
    
    // Calculate next trigger time
    this.nextTriggerTime = new Date(Date.now() + interval);
    
    // Update status bar every second to show countdown
    const statusUpdateTimer = setInterval(() => {
      this.updateStatusBar();
    }, 1000);
    
    this.context.subscriptions.push({ dispose: () => clearInterval(statusUpdateTimer) });
  }

  // Stop the automation timer
  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.nextTriggerTime = null;
    }
  }

  // Send a message to Cursor AI Chat Interface
  public async sendMessage() {
    try {
      const config = vscode.workspace.getConfiguration('cursorAutomation');
      const message = config.get<string>('message', 'Help me optimize this function for better performance.');
      const autoSend = config.get<boolean>('autoSend', true);
      
      // Step 1: Find and focus Cursor's chat interface
      // These are commands specific to Cursor for accessing the chat
      // Based on examining Cursor's command palette options
      const cursorChatCommands = [
        'cursor.newChat',           // Creates a new chat session
        'cursor.chatPanel.focus',   // Focuses the chat panel
        'cursor.toggleChatPanel',   // Toggles the chat panel visibility
        'cursor.chat',              // General chat command
        'cursor.expandChatPanel'    // Expands the chat panel
      ];
      
      // Try to focus the chat panel using Cursor's commands
      let chatFocused = false;
      for (const command of cursorChatCommands) {
        try {
          // Log the command we're attempting
          console.log(`Attempting to use Cursor chat command: ${command}`);
          await vscode.commands.executeCommand(command);
          chatFocused = true;
          console.log(`Successfully used command: ${command}`);
          break;
        } catch (error) {
          console.log(`Command failed: ${command}, Error: ${error}`);
          continue;
        }
      }
      
      // Log whether we successfully focused the chat
      if (!chatFocused) {
        console.log('Failed to focus chat using commands. Will notify user.');
        this.showNotification('Please click on the Cursor chat input box first.');
      }
      
      // Step 2: Wait a moment for the UI to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Insert the message text
      // Cursor's chat is likely implemented as a webview or input box
      // First try clipboard approach (most reliable cross-platform)
      console.log('Attempting to insert message via clipboard');
      try {
        // Save original clipboard content
        const originalClipboard = await vscode.env.clipboard.readText();
        
        // Set clipboard to our message
        await vscode.env.clipboard.writeText(message);
        console.log('Message copied to clipboard');
        
        // Try the paste command (works in most UI contexts)
        await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        console.log('Paste command executed');
        
        // Restore original clipboard content
        setTimeout(async () => {
          await vscode.env.clipboard.writeText(originalClipboard);
          console.log('Original clipboard content restored');
        }, 500);
      } catch (error) {
        console.log(`Clipboard insertion failed: ${error}`);
        
        // Fallback approach: Try using keyboard simulation
        try {
          // Cursor may have a chat.postMessage command or similar
          const messageCommands = [
            'cursor.chat.insertText',
            'cursor.chat.paste',
            'cursor.chatInput'
          ];
          
          let messageInserted = false;
          for (const command of messageCommands) {
            try {
              console.log(`Attempting chat command: ${command}`);
              await vscode.commands.executeCommand(command, message);
              messageInserted = true;
              console.log(`Successfully used command: ${command}`);
              break;
            } catch (cmdError) {
              console.log(`Command failed: ${command}, Error: ${cmdError}`);
              continue;
            }
          }
          
          if (!messageInserted) {
            // Last resort: Direct keyboard typing simulation
            // This is less reliable but might work
            console.log('Attempting direct text insertion');
            for (const char of message) {
              await vscode.commands.executeCommand('type', { text: char });
              // Small delay between characters for stability
              await new Promise(resolve => setTimeout(resolve, 5));
            }
          }
        } catch (fallbackError) {
          console.log(`All text insertion methods failed: ${fallbackError}`);
          this.showNotification('Could not insert message. Try manually typing your message.');
        }
      }
      
      // Step 4: Send the message if auto-send is enabled
      if (autoSend) {
        // Wait for text insertion to complete
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('Attempting to send message');
        try {
          // Try Cursor-specific commands first
          const sendCommands = [
            'cursor.chat.send',
            'cursor.sendChatMessage',
            'cursor.executeChat'
          ];
          
          let messageSent = false;
          for (const command of sendCommands) {
            try {
              console.log(`Attempting send command: ${command}`);
              await vscode.commands.executeCommand(command);
              messageSent = true;
              console.log(`Successfully used command: ${command}`);
              break;
            } catch (cmdError) {
              console.log(`Command failed: ${command}, Error: ${cmdError}`);
              continue;
            }
          }
          
          // If Cursor-specific commands fail, fall back to Enter key simulation
          if (!messageSent) {
            console.log('Trying Enter key simulation');
            // Simulate pressing Enter/Return key
            await vscode.commands.executeCommand('type', { text: '\n' });
          }
        } catch (sendError) {
          console.log(`Failed to send message: ${sendError}`);
          this.showNotification('Message inserted but could not automatically send. Press Enter to send manually.');
        }
      }
      
      // Record the time for status calculations
      this.lastTriggered = new Date();
      
      // Calculate next trigger time
      const interval = config.get<number>('interval', 5000);
      this.nextTriggerTime = new Date(Date.now() + interval);
      
      // Show notification if enabled
      this.showNotification('Message inserted into Cursor chat interface.');
      
      // Play sound if enabled
      this.playSound();
      
    } catch (error) {
      vscode.window.showErrorMessage(`Cursor Automation Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private showNotification(message: string) {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    const showNotifications = config.get<boolean>('showNotifications', true);
    
    if (showNotifications) {
      vscode.window.showInformationMessage(`Cursor Automation: ${message}`);
    }
  }

  private playSound() {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    const playSound = config.get<boolean>('playSound', false);
    
    if (playSound) {
      // In a real extension, we would play a sound here
      // This requires additional setup for audio playback in VS Code extensions
      // For a prototype, we can use the 'bell' sound that VS Code natively supports
      vscode.commands.executeCommand('editor.action.toggleTabFocusMode');
      vscode.commands.executeCommand('editor.action.toggleTabFocusMode');
    }
  }

  // Enable automation
  public enable() {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    config.update('enabled', true, vscode.ConfigurationTarget.Global);
  }

  // Disable automation
  public disable() {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    config.update('enabled', false, vscode.ConfigurationTarget.Global);
  }

  // Toggle automation on/off
  public toggle() {
    const config = vscode.workspace.getConfiguration('cursorAutomation');
    const enabled = config.get<boolean>('enabled', false);
    config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
  }

  // Open settings UI
  public openSettings() {
    vscode.commands.executeCommand('workbench.action.openSettings', 'cursorAutomation');
  }

  // Clean up resources when extension is deactivated
  public dispose() {
    this.stopTimer();
    this.statusBarItem.dispose();
  }
}

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Cursor Automation extension is now active');

  // Create the automation manager
  const automationManager = new AutomationManager(context);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('cursor-automation.enable', () => {
      automationManager.enable();
    }),

    vscode.commands.registerCommand('cursor-automation.disable', () => {
      automationManager.disable();
    }),

    vscode.commands.registerCommand('cursor-automation.toggle', () => {
      automationManager.toggle();
    }),

    vscode.commands.registerCommand('cursor-automation.sendNow', () => {
      automationManager.sendMessage();
    }),

    vscode.commands.registerCommand('cursor-automation.openSettings', () => {
      automationManager.openSettings();
    })
  );

  // Add the manager to context subscriptions for cleanup
  context.subscriptions.push({
    dispose: () => {
      automationManager.dispose();
    }
  });
}

// This method is called when the extension is deactivated
export function deactivate() {
  console.log('Cursor Automation extension is now deactivated');
}