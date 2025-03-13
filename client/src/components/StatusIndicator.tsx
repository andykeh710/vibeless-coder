import React, { useState, useEffect } from "react";
import { useAutomation } from "@/context/AutomationContext";

const StatusIndicator: React.FC = () => {
  const { state, triggerNow, resetTimer } = useAutomation();
  const [timeDisplay, setTimeDisplay] = useState({ lastTriggered: "", nextTrigger: "" });

  useEffect(() => {
    const updateTimeDisplay = () => {
      // Last triggered time
      if (state.lastTriggered) {
        const now = new Date();
        const diff = now.getTime() - state.lastTriggered.getTime();
        
        if (diff < 1000) {
          setTimeDisplay(prev => ({ ...prev, lastTriggered: "just now" }));
        } else if (diff < 60000) {
          setTimeDisplay(prev => ({ ...prev, lastTriggered: `${Math.floor(diff / 1000)} seconds ago` }));
        } else if (diff < 3600000) {
          setTimeDisplay(prev => ({ ...prev, lastTriggered: `${Math.floor(diff / 60000)} minutes ago` }));
        } else {
          setTimeDisplay(prev => ({ ...prev, lastTriggered: "more than an hour ago" }));
        }
      } else {
        setTimeDisplay(prev => ({ ...prev, lastTriggered: "never" }));
      }
      
      // Next trigger time
      if (state.nextTriggerTime && state.enabled) {
        const now = new Date();
        const diff = state.nextTriggerTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeDisplay(prev => ({ ...prev, nextTrigger: "any moment" }));
        } else {
          setTimeDisplay(prev => ({ ...prev, nextTrigger: `${(diff / 1000).toFixed(1)} seconds` }));
        }
      } else {
        setTimeDisplay(prev => ({ ...prev, nextTrigger: "disabled" }));
      }
    };
    
    updateTimeDisplay();
    const intervalId = setInterval(updateTimeDisplay, 100);
    
    return () => clearInterval(intervalId);
  }, [state.lastTriggered, state.nextTriggerTime, state.enabled]);

  return (
    <div className="px-4 py-3">
      <h3 className="font-semibold mb-2">Status</h3>
      
      <div className="flex items-center mb-2">
        <div 
          className={`h-3 w-3 rounded-full mr-2 ${state.enabled ? 'bg-[#6A9955]' : 'bg-[#505050]'}`}
        />
        <span className="text-sm">{state.enabled ? 'Active' : 'Inactive'}</span>
      </div>
      
      <div className="text-xs text-[#D4D4D4] opacity-70">
        <div className="mb-1">Last triggered: <span>{timeDisplay.lastTriggered}</span></div>
        <div>Next trigger in: <span>{timeDisplay.nextTrigger}</span></div>
      </div>
      
      <div className="mt-3">
        <button 
          className="px-3 py-1 bg-[#1F1F1F] hover:bg-[#2A2D2E] border border-[#3D3D3D] rounded text-sm focus:outline-none mr-2"
          onClick={triggerNow}
        >
          Trigger Now
        </button>
        <button 
          className="px-3 py-1 bg-[#1F1F1F] hover:bg-[#2A2D2E] border border-[#3D3D3D] rounded text-sm focus:outline-none"
          onClick={resetTimer}
        >
          Reset Timer
        </button>
      </div>
    </div>
  );
};

export default StatusIndicator;
