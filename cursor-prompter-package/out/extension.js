"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
// Define class for automation management with enhanced reliability and features
class CursorPrompter {
    constructor(context) {
        this.nextTriggerTime = null;
        this.messageIndex = 0;
        this.lastAttemptFailed = false;
        this.retryCount = 0;
        this.MAX_RETRIES = 3;
        this.lastError = null;
        this.compatibleFocusCommands = [];
        this.lastCheckedVersion = null;
        this.context = context;
        // Create status bar item with enhanced visual feedback
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'cursor-prompter.toggle';
        this.updateStatusBar();
        this.statusBarItem.show();
        // Register configuration change listener
        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(this.handleConfigChange, this));
        // Load cached compatible commands if available
        this.loadCompatibleCommands();
        // Start timer if enabled by default
        this.handleConfigChange();
    }
    loadCompatibleCommands() {
        try {
            this.compatibleFocusCommands = this.context.globalState.get('compatibleFocusCommands') || [];
            this.lastCheckedVersion = this.context.globalState.get('lastCheckedVersion') || null;
            console.log('Loaded compatible focus commands:', this.compatibleFocusCommands);
        }
        catch (error) {
            console.error('Failed to load compatible commands from storage:', error);
            this.compatibleFocusCommands = [];
        }
    }
    saveCompatibleCommands() {
        try {
            this.context.globalState.update('compatibleFocusCommands', this.compatibleFocusCommands);
            this.context.globalState.update('lastCheckedVersion', this.lastCheckedVersion);
            console.log('Saved compatible focus commands:', this.compatibleFocusCommands);
        }
        catch (error) {
            console.error('Failed to save compatible commands to storage:', error);
        }
    }
    handleConfigChange(e) {
        if (!e || e.affectsConfiguration('cursorPrompter')) {
            const config = vscode.workspace.getConfiguration('cursorPrompter');
            const enabled = config.get('enabled', false);
            if (enabled) {
                this.startTimer();
            }
            else {
                this.stopTimer();
            }
            this.updateStatusBar();
        }
    }
    updateStatusBar() {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        const enabled = config.get('enabled', false);
        if (enabled) {
            // Show different icon if last attempt failed
            const icon = this.lastAttemptFailed ? '$(alert)' : '$(comment)';
            this.statusBarItem.text = `${icon} Cursor Prompter: ON`;
            this.statusBarItem.backgroundColor = this.lastAttemptFailed
                ? new vscode.ThemeColor('statusBarItem.errorBackground')
                : new vscode.ThemeColor('statusBarItem.warningBackground');
            if (this.nextTriggerTime) {
                const remainingMs = this.nextTriggerTime.getTime() - Date.now();
                const remainingSec = Math.max(0, Math.floor(remainingMs / 1000));
                let tooltipText = `Next prompt in ${remainingSec}s`;
                if (this.lastAttemptFailed && this.lastError) {
                    tooltipText += ` (Error: ${this.lastError})`;
                }
                this.statusBarItem.tooltip = tooltipText;
            }
            else {
                let tooltipText = 'Cursor Prompter is running';
                if (this.lastAttemptFailed && this.lastError) {
                    tooltipText += ` (Error: ${this.lastError})`;
                }
                this.statusBarItem.tooltip = tooltipText;
            }
        }
        else {
            this.statusBarItem.text = '$(comment) Cursor Prompter: OFF';
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.tooltip = 'Cursor Prompter is inactive';
            // Reset failure flag when disabled
            this.lastAttemptFailed = false;
            this.lastError = null;
        }
    }
    // Start the automation timer with enhanced reliability
    startTimer() {
        // Clear any existing timer
        this.stopTimer();
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        const interval = config.get('interval', 30000);
        // Set up new timer with error handling
        this.timer = setInterval(() => {
            try {
                this.sendMessage();
            }
            catch (error) {
                console.error('Error in timer callback:', error);
                this.lastAttemptFailed = true;
                this.lastError = error instanceof Error ? error.message : String(error);
                this.showNotification(`Error: ${this.lastError}`);
                this.updateStatusBar();
            }
        }, interval);
        // Calculate next trigger time
        this.nextTriggerTime = new Date(Date.now() + interval);
        // Update status bar every second to show countdown
        this.statusUpdateTimer = setInterval(() => {
            if (this.nextTriggerTime) {
                const remainingMs = this.nextTriggerTime.getTime() - Date.now();
                if (remainingMs <= 0) {
                    this.nextTriggerTime = new Date(Date.now() + interval);
                }
            }
            this.updateStatusBar();
        }, 1000);
        // Register for automatic cleanup
        this.context.subscriptions.push({ dispose: () => {
                if (this.statusUpdateTimer) {
                    clearInterval(this.statusUpdateTimer);
                    this.statusUpdateTimer = undefined;
                }
            } });
        // Reset error state when starting timer
        this.lastAttemptFailed = false;
        this.lastError = null;
        this.retryCount = 0;
        // Log and notify
        console.log('Cursor Prompter timer started with interval:', interval);
        this.showNotification('Prompter activated');
    }
    // Stop the automation timer and clean up
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        if (this.statusUpdateTimer) {
            clearInterval(this.statusUpdateTimer);
            this.statusUpdateTimer = undefined;
        }
        this.nextTriggerTime = null;
        console.log('Cursor Prompter timer stopped');
        this.showNotification('Prompter deactivated');
    }
    // Try to focus Cursor chat using any available method
    async focusCursorChat() {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        const configuredCommand = config.get('focusCommand', 'cursor.chatPanel.focus');
        // First, try the configured command
        try {
            await vscode.commands.executeCommand(configuredCommand);
            console.log(`Successfully focused chat using configured command: ${configuredCommand}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Wait for UI update
            return true;
        }
        catch (error) {
            console.log(`Configured focus command failed: ${error}`);
            // If we have cached compatible commands, try those first
            if (this.compatibleFocusCommands.length > 0) {
                console.log('Trying cached compatible commands:', this.compatibleFocusCommands);
                for (const cmd of this.compatibleFocusCommands) {
                    try {
                        await vscode.commands.executeCommand(cmd);
                        console.log(`Successfully focused chat using cached command: ${cmd}`);
                        await new Promise(resolve => setTimeout(resolve, 300)); // Wait for UI update
                        return true;
                    }
                    catch (cmdError) {
                        console.log(`Cached focus command failed: ${cmd}, error: ${cmdError}`);
                    }
                }
            }
            // Fall back to trying all potential commands
            return this.tryFocusMethods();
        }
    }
    // Try all potential focus methods in sequence
    async tryFocusMethods() {
        const focusCommands = [
            'cursor.chatPanel.focus',
            'cursor.toggleChatPanel',
            'cursor.chat',
            'cursor.newChat',
            'cursor.expandChatPanel',
            'cursor.copilot.focus',
            'cursor.focusChat'
        ];
        for (const cmd of focusCommands) {
            try {
                console.log(`Trying focus command: ${cmd}`);
                await vscode.commands.executeCommand(cmd);
                // Small delay to allow UI to update
                await new Promise(resolve => setTimeout(resolve, 300));
                // If successful, add to compatible commands cache
                if (!this.compatibleFocusCommands.includes(cmd)) {
                    this.compatibleFocusCommands.push(cmd);
                    this.saveCompatibleCommands();
                }
                return true;
            }
            catch (error) {
                console.log(`Focus command failed: ${cmd}, error: ${error}`);
            }
        }
        return false;
    }
    // Enhanced message sending with improved clipboard handling
    async sendMessage() {
        let originalClipboard = '';
        try {
            const config = vscode.workspace.getConfiguration('cursorPrompter');
            const useSequence = config.get('useMessageSequence', true);
            let message;
            if (useSequence) {
                const messages = config.get('messageSequence', [
                    'Continue with your previous thoughts.',
                    'What else would you suggest?',
                    'Please elaborate more on this topic.',
                    'Can you provide more specific details?',
                    'Are there any potential issues with this approach?',
                    'Could you expand on the advantages of this solution?'
                ]);
                // Protection against empty message array
                if (messages.length === 0) {
                    messages.push('Continue with your previous thoughts.');
                }
                // Get the next message in sequence
                message = messages[this.messageIndex % messages.length];
                this.messageIndex++;
                console.log(`Using message ${this.messageIndex} in sequence:`, message);
            }
            else {
                message = config.get('message', 'Continue with your previous thoughts.');
            }
            // Step 1: Focus Cursor's chat interface using enhanced method
            const focusSucceeded = await this.focusCursorChat();
            if (!focusSucceeded) {
                this.lastAttemptFailed = true;
                this.lastError = 'Failed to focus chat panel';
                this.updateStatusBar();
                this.showNotification('Failed to focus chat panel. Please open Cursor chat panel first.');
                return;
            }
            // Step 2: Preserve original clipboard content with enhanced error handling
            try {
                originalClipboard = await vscode.env.clipboard.readText();
                console.log('Original clipboard content saved');
            }
            catch (error) {
                console.log('Failed to read clipboard:', error);
                originalClipboard = '';
                // Continue anyway, we'll just not be able to restore the clipboard
            }
            // Step 3: Insert message using clipboard with retry mechanism
            let clipboardWriteSuccess = false;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await vscode.env.clipboard.writeText(message);
                    console.log(`Message copied to clipboard (attempt ${attempt + 1})`);
                    clipboardWriteSuccess = true;
                    break;
                }
                catch (error) {
                    console.log(`Failed to write to clipboard (attempt ${attempt + 1}):`, error);
                    await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause before retry
                }
            }
            if (!clipboardWriteSuccess) {
                this.lastAttemptFailed = true;
                this.lastError = 'Failed to access clipboard';
                this.updateStatusBar();
                this.showNotification('Failed to access clipboard. Check clipboard permissions.');
                return;
            }
            // Step 4: Paste the message into the chat with retry mechanism
            let pasteSuccess = false;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
                    console.log(`Message pasted successfully (attempt ${attempt + 1})`);
                    pasteSuccess = true;
                    // Reset failure flags on success
                    this.lastAttemptFailed = false;
                    this.lastError = null;
                    this.retryCount = 0;
                    break;
                }
                catch (error) {
                    console.log(`Paste failed (attempt ${attempt + 1}):`, error);
                    await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause before retry
                    // Try to refocus before retry
                    await this.focusCursorChat();
                }
            }
            if (!pasteSuccess) {
                this.lastAttemptFailed = true;
                this.lastError = 'Failed to paste message';
                this.retryCount++;
                // Only show notification if we haven't already tried too many times
                if (this.retryCount <= this.MAX_RETRIES) {
                    this.showNotification('Paste failed. Please check Cursor chat is focused.');
                }
                // Restore original clipboard and exit
                await this.tryRestoreClipboard(originalClipboard);
                this.updateStatusBar();
                return;
            }
            // Step 5: Restore original clipboard after a short delay
            await this.tryRestoreClipboard(originalClipboard);
            // Step 6: Send the message if auto-send is enabled
            const autoSend = config.get('autoSend', true);
            if (autoSend) {
                // Wait for text insertion to complete
                await new Promise(resolve => setTimeout(resolve, 300));
                try {
                    // Try Enter key simulation (most universal method)
                    await vscode.commands.executeCommand('type', { text: '\n' });
                    console.log('Enter key sent');
                }
                catch (error) {
                    console.log(`Failed to send message: ${error}`);
                    this.lastAttemptFailed = true;
                    this.lastError = 'Failed to send message (Enter key)';
                    this.updateStatusBar();
                    this.showNotification('Message inserted but not sent. Press Enter manually.');
                    return;
                }
            }
            // Calculate next trigger time
            const interval = config.get('interval', 30000);
            this.nextTriggerTime = new Date(Date.now() + interval);
            // Show notification if enabled
            this.showNotification(`Sent: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`);
        }
        catch (error) {
            // Something went wrong, restore clipboard if we have it
            this.tryRestoreClipboard(originalClipboard);
            console.error('Error in sendMessage:', error);
            this.lastAttemptFailed = true;
            this.lastError = error instanceof Error ? error.message : String(error);
            this.updateStatusBar();
            vscode.window.showErrorMessage(`Cursor Prompter Error: ${this.lastError}`);
        }
    }
    // Improved clipboard restoration with retry mechanism
    async tryRestoreClipboard(content) {
        if (!content) {
            return; // Nothing to restore
        }
        // Try to restore clipboard content with retries
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                // Small delay before restoring clipboard
                await new Promise(resolve => setTimeout(resolve, 300));
                await vscode.env.clipboard.writeText(content);
                console.log(`Original clipboard content restored (attempt ${attempt + 1})`);
                return; // Success
            }
            catch (error) {
                console.log(`Failed to restore clipboard (attempt ${attempt + 1}):`, error);
                await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause before retry
            }
        }
        console.log('All clipboard restore attempts failed');
    }
    showNotification(message) {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        const showNotifications = config.get('showNotifications', true);
        if (showNotifications) {
            vscode.window.showInformationMessage(`Cursor Prompter: ${message}`);
        }
        console.log('Cursor Prompter:', message);
    }
    // Enable automation
    enable() {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        config.update('enabled', true, vscode.ConfigurationTarget.Global);
    }
    // Disable automation
    disable() {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        config.update('enabled', false, vscode.ConfigurationTarget.Global);
    }
    // Toggle automation on/off
    toggle() {
        const config = vscode.workspace.getConfiguration('cursorPrompter');
        const enabled = config.get('enabled', false);
        config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
    }
    // Open settings UI
    openSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', 'cursorPrompter');
    }
    // Enhanced test for focus commands with caching
    async testFocusCommands() {
        const focusCommands = [
            'cursor.chatPanel.focus',
            'cursor.toggleChatPanel',
            'cursor.chat',
            'cursor.newChat',
            'cursor.expandChatPanel',
            'cursor.copilot.focus',
            'cursor.focusChat'
        ];
        // Get current Cursor version if available
        let cursorVersion = 'unknown';
        try {
            const extensions = vscode.extensions.all;
            const cursorExt = extensions.find(ext => ext.id === 'cursor.cursor' || ext.id.includes('cursor'));
            if (cursorExt) {
                cursorVersion = cursorExt.packageJSON.version || 'unknown';
            }
        }
        catch (error) {
            console.log('Failed to get Cursor version:', error);
        }
        // If version is same as last checked and we have compatible commands, skip test
        if (this.lastCheckedVersion === cursorVersion && this.compatibleFocusCommands.length > 0) {
            this.showNotification(`Using cached focus commands: ${this.compatibleFocusCommands.join(', ')}`);
            // Still check if configured command is in the compatible list
            const config = vscode.workspace.getConfiguration('cursorPrompter');
            const currentFocusCmd = config.get('focusCommand', 'cursor.chatPanel.focus');
            if (!this.compatibleFocusCommands.includes(currentFocusCmd) && this.compatibleFocusCommands.length > 0) {
                const recommended = this.compatibleFocusCommands[0];
                const changeCmd = await vscode.window.showInformationMessage(`Your current focus command "${currentFocusCmd}" isn't in the compatible list, but "${recommended}" works. Change to that?`, 'Yes', 'No');
                if (changeCmd === 'Yes') {
                    config.update('focusCommand', recommended, vscode.ConfigurationTarget.Global);
                    this.showNotification(`Focus command changed to: ${recommended}`);
                }
            }
            return;
        }
        // Start fresh test
        this.showNotification('Testing focus commands for compatibility...');
        let workingCommands = [];
        for (const cmd of focusCommands) {
            try {
                console.log(`Testing focus command: ${cmd}`);
                await vscode.commands.executeCommand(cmd);
                workingCommands.push(cmd);
                console.log(`Command succeeded: ${cmd}`);
                // Undo the effect (close panel if it was opened)
                if (cmd !== 'cursor.chatPanel.focus') {
                    try {
                        await vscode.commands.executeCommand('cursor.toggleChatPanel');
                    }
                    catch (error) {
                        // Ignore errors when trying to close
                    }
                }
            }
            catch (error) {
                console.log(`Command failed: ${cmd}, error: ${error}`);
            }
        }
        if (workingCommands.length > 0) {
            // Update cache
            this.compatibleFocusCommands = workingCommands;
            this.lastCheckedVersion = cursorVersion;
            this.saveCompatibleCommands();
            this.showNotification(`Working focus commands: ${workingCommands.join(', ')}`);
            // If current focus command isn't working but we found alternatives, suggest changing
            const config = vscode.workspace.getConfiguration('cursorPrompter');
            const currentFocusCmd = config.get('focusCommand', 'cursor.chatPanel.focus');
            if (!workingCommands.includes(currentFocusCmd) && workingCommands.length > 0) {
                const recommended = workingCommands[0];
                const changeCmd = await vscode.window.showInformationMessage(`Your current focus command "${currentFocusCmd}" doesn't work, but "${recommended}" does. Change to that?`, 'Yes', 'No');
                if (changeCmd === 'Yes') {
                    config.update('focusCommand', recommended, vscode.ConfigurationTarget.Global);
                    this.showNotification(`Focus command changed to: ${recommended}`);
                }
            }
        }
        else {
            this.showNotification('No working focus commands found. Please ensure Cursor chat features are available.');
        }
    }
    // Clean up resources when extension is deactivated
    dispose() {
        this.stopTimer();
        this.statusBarItem.dispose();
    }
}
// This method is called when the extension is activated
function activate(context) {
    console.log('Cursor Prompter extension is now active');
    // Create the prompter instance
    const cursorPrompter = new CursorPrompter(context);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('cursor-prompter.enable', () => {
        cursorPrompter.enable();
    }), vscode.commands.registerCommand('cursor-prompter.disable', () => {
        cursorPrompter.disable();
    }), vscode.commands.registerCommand('cursor-prompter.toggle', () => {
        cursorPrompter.toggle();
    }), vscode.commands.registerCommand('cursor-prompter.sendNow', () => {
        cursorPrompter.sendMessage();
    }), vscode.commands.registerCommand('cursor-prompter.openSettings', () => {
        cursorPrompter.openSettings();
    }), vscode.commands.registerCommand('cursor-prompter.testFocusCommands', () => {
        cursorPrompter.testFocusCommands();
    }));
    // Add the prompter to context subscriptions for cleanup
    context.subscriptions.push({
        dispose: () => {
            cursorPrompter.dispose();
        }
    });
}
exports.activate = activate;
// This method is called when the extension is deactivated
function deactivate() {
    console.log('Cursor Prompter extension is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map