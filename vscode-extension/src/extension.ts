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

  // Send a message to Cursor AI
  public async sendMessage() {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        // No active editor
        this.showNotification('No active editor found.');
        return;
      }
      
      const config = vscode.workspace.getConfiguration('cursorAutomation');
      const message = config.get<string>('message', 'Help me optimize this function for better performance.');
      const handleMultiCursor = config.get<boolean>('handleMultiCursor', true);
      const cursorBehavior = config.get<string>('cursorBehavior', 'stay');
      const autoSend = config.get<boolean>('autoSend', true);
      
      // Store the current selections to restore them if needed
      const originalSelections = editor.selections;
      
      // Insert message at each cursor position or only at the primary position
      if (handleMultiCursor) {
        // Handle multiple cursors
        await editor.edit(editBuilder => {
          for (const selection of editor.selections) {
            editBuilder.insert(selection.active, message);
          }
        });
      } else {
        // Only use primary cursor
        await editor.edit(editBuilder => {
          editBuilder.insert(editor.selection.active, message);
        });
      }
      
      // Handle cursor behavior after insertion
      switch (cursorBehavior) {
        case 'stay':
          // Do nothing, cursors stay where they are
          break;
        case 'end':
          // Move cursors to the end of inserted text
          editor.selections = editor.selections.map(sel => {
            const newPosition = sel.active.translate(0, message.length);
            return new vscode.Selection(newPosition, newPosition);
          });
          break;
        case 'start':
          // Restore original cursor positions
          editor.selections = originalSelections;
          break;
      }
      
      // Trigger "send to Cursor AI" if configured
      if (autoSend) {
        try {
          // Try to find Cursor's specific command for sending messages
          // For actual implementation, we need to know Cursor's exact command name
          // Common possibilities might be:
          const possibleCommands = [
            'cursor.sendToAgent',
            'cursor.chat',
            'cursor.sendSelection',
            'cursor.executePrompt',
            'extension.cursor.chat'
          ];
          
          // Try to execute each possible command until one works
          for (const command of possibleCommands) {
            try {
              await vscode.commands.executeCommand(command);
              break; // If successful, stop trying other commands
            } catch (error) {
              // Command not found, try the next one
              continue;
            }
          }
        } catch (error) {
          this.showNotification('Failed to send message to Cursor AI. The message was inserted but not sent.');
        }
      }
      
      // Record the time for status calculations
      this.lastTriggered = new Date();
      
      // Calculate next trigger time
      const interval = config.get<number>('interval', 5000);
      this.nextTriggerTime = new Date(Date.now() + interval);
      
      // Show notification if enabled
      this.showNotification('Message inserted at cursor position.');
      
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