import React, { useState } from "react";
import { useAutomation } from "@/context/AutomationContext";

const AdvancedSettings: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { state, setCursorBehavior, toggleHandleMultiCursor } = useAutomation();

  const toggleAdvancedSettings = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCursorBehaviorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCursorBehavior(e.target.value);
  };

  return (
    <div className="px-4 py-3 border-b border-[#3D3D3D]">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={toggleAdvancedSettings}
      >
        <h3 className="font-semibold">Advanced Options</h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      <div className={`mt-2 ${isExpanded ? '' : 'hidden'}`}>
        <div className="mb-3">
          <label htmlFor="keyboardShortcut" className="block text-sm mb-1">Keyboard Shortcut</label>
          <div className="flex items-center bg-[#1F1F1F] border border-[#3D3D3D] rounded px-2 py-1">
            <input 
              type="text" 
              id="keyboardShortcut" 
              value="Alt+Shift+M" 
              readOnly
              className="bg-transparent border-none w-full text-sm focus:outline-none" 
            />
            <button 
              className="text-xs text-[#007ACC] hover:text-white"
              onClick={() => alert('Shortcut editing would open VS Code keyboard shortcuts UI')}
            >
              Edit
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="cursorBehavior" className="block text-sm mb-1">After sending message</label>
          <select 
            id="cursorBehavior"
            value={state.cursorBehavior}
            onChange={handleCursorBehaviorChange}
            className="w-full bg-[#1F1F1F] border border-[#3D3D3D] rounded px-2 py-1 text-sm focus:border-[#007ACC] focus:outline-none"
          >
            <option value="stay">Keep cursor in place</option>
            <option value="end">Move cursor to end of line</option>
            <option value="newline">Add new line after message</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="handleMultiCursor" 
            checked={state.handleMultiCursor}
            onChange={toggleHandleMultiCursor}
            className="mr-2 h-4 w-4 bg-[#1F1F1F] border border-[#3D3D3D] rounded" 
          />
          <label htmlFor="handleMultiCursor" className="text-sm">Apply to all cursor positions</label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
