import React from "react";
import { useAutomation } from "@/context/AutomationContext";
import NotificationToast from "@/components/NotificationToast";

const EditorPreview: React.FC = () => {
  const { state } = useAutomation();
  
  // Calculate time remaining for next trigger
  const getTimeRemaining = () => {
    if (!state.nextTriggerTime || !state.enabled) return null;
    const now = new Date();
    const remainingMs = state.nextTriggerTime.getTime() - now.getTime();
    if (remainingMs <= 0) return "0.0s";
    return `${(remainingMs / 1000).toFixed(1)}s`;
  };
  
  const timeRemaining = getTimeRemaining();

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Title Bar */}
      <div className="bg-[#1F1F1F] h-9 flex items-center justify-between px-3 border-b border-[#3D3D3D]">
        <div className="flex items-center">
          <span className="text-sm">main.js</span>
          <span className="ml-2 px-1 text-xs bg-[#3D3D3D] rounded">JavaScript</span>
        </div>
        <div className="flex text-[#D4D4D4]">
          <button className="p-1 hover:text-white focus:outline-none" title="Split Editor">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="3" x2="12" y2="21"></line>
            </svg>
          </button>
          <button className="p-1 hover:text-white focus:outline-none" title="More Actions">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Editor Content Area */}
      <div className="flex-1 relative overflow-auto">
        <div className="flex">
          {/* Line Numbers */}
          <div className="text-right pr-2 select-none bg-[#1F1F1F] text-opacity-50 text-[#D4D4D4] border-r border-[#3D3D3D] py-2">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="h-6 px-2">{i + 1}</div>
            ))}
          </div>
          
          {/* Code Editor */}
          <div className="py-2 pl-4 w-full font-mono">
            <pre className="text-[#D4D4D4] font-mono text-sm leading-6">
              <span className="text-yellow-400">import</span> <span className="text-[#D4D4D4]">* </span><span className="text-yellow-400">as</span><span className="text-[#D4D4D4]"> vscode </span><span className="text-yellow-400">from</span><span className="text-[#D4D4D4]"> </span><span className="text-green-400">'vscode'</span><span className="text-[#D4D4D4]">;</span>
              <br />
              <span className="text-yellow-400">import</span><span className="text-[#D4D4D4]"> {"{ sendMessage }"} </span><span className="text-yellow-400">from</span><span className="text-[#D4D4D4]"> </span><span className="text-green-400">'./commands'</span><span className="text-[#D4D4D4]">;</span>
              <br />
              <span className="text-yellow-400">import</span><span className="text-[#D4D4D4]"> {"{ getTimerInterval }"} </span><span className="text-yellow-400">from</span><span className="text-[#D4D4D4]"> </span><span className="text-green-400">'./config'</span><span className="text-[#D4D4D4]">;</span>
              <br /><br />
              <span className="text-yellow-400">let</span><span className="text-[#D4D4D4]"> timer: NodeJS.Timeout;</span>
              <br /><br />
              <span className="text-purple-400">export function</span><span className="text-blue-400"> activate</span><span className="text-[#D4D4D4]">(context: vscode.ExtensionContext) {"{"}</span>
              <br />
              <span className="text-green-400">  // Register custom command</span>
              <br />
              <span className="text-yellow-400">  const</span><span className="text-[#D4D4D4]"> disposable = vscode.commands.registerCommand(</span><span className="text-green-400">'extension.sendMessage'</span><span className="text-[#D4D4D4]">, () {'>'} {'{'}</span>
              <br />
              <span className="text-blue-400">    sendMessage</span><span className="text-[#D4D4D4]">();</span>
              <br />
              <span className="text-[#D4D4D4]">  {"}"});</span>
              <br />
              <span className="text-[#D4D4D4]">  context.subscriptions.push(disposable);</span>
              <br /><br />
              <span className="text-green-400">  // Start the timer</span>
              <br />
              <span className="text-yellow-400">  const</span><span className="text-[#D4D4D4]"> interval = </span><span className="text-blue-400">getTimerInterval</span><span className="text-[#D4D4D4]">();</span><span className="text-orange-400 bg-blue-900/20 px-2 mx-1 border-l-2 border-[#007ACC]">{state.messageText}</span>
              <br />
              <span className="text-[#D4D4D4]">  timer = </span><span className="text-blue-400">setInterval</span><span className="text-[#D4D4D4]">(() {'>'} {'{'}</span>
              <br />
              <span className="text-green-400">    // Execute command on timer tick</span>
              <br />
              <span className="text-[#D4D4D4]">    vscode.commands.executeCommand(</span><span className="text-green-400">'extension.sendMessage'</span><span className="text-[#D4D4D4]">);</span>
              <br />
              <span className="text-[#D4D4D4]">  {"}"}, interval);</span>
              <br /><br />
              <span className="text-green-400">  // Listen for configuration changes</span>
              <br />
              <span className="text-[#D4D4D4]">  vscode.workspace.onDidChangeConfiguration(e {'>'} {'{'}</span>
            </pre>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#1F1F1F] border-t border-[#3D3D3D] flex items-center px-3 text-xs text-[#D4D4D4] justify-between">
        <div className="flex items-center">
          <div className={`flex items-center mr-3 ${state.enabled ? 'text-[#6A9955]' : 'text-[#505050]'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 h1 a9 9 0 0 1 9 9 v1 a9 9 0 0 1 -9 9 h-1 a9 9 0 0 1 -9 -9 v-1 a9 9 0 0 1 9 -9 z"></path>
              <circle cx="8" cy="9" r="1"></circle>
              <circle cx="16" cy="9" r="1"></circle>
              <path d="M7 13h10a4 4 0 0 1 0 6H7a4 4 0 0 1 0 -6z"></path>
            </svg>
            <span>{state.enabled ? 'Automation Active' : 'Automation Inactive'}</span>
          </div>
          {state.enabled && timeRemaining && (
            <div className="mr-3 px-1 rounded bg-[#264F78]">
              Next: {timeRemaining}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="mx-2">JavaScript</div>
          <div className="mx-2">UTF-8</div>
          <div className="mx-2">Ln 12, Col 42</div>
        </div>
      </div>
      
      {/* Notification Toast */}
      {state.lastTriggered && state.showNotifications && (
        <NotificationToast
          title="Message Inserted"
          description="The configured message has been inserted at the cursor position."
          timestamp={state.lastTriggered}
        />
      )}
    </div>
  );
};

export default EditorPreview;
