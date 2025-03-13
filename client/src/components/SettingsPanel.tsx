import React from "react";
import EnableToggle from "./EnableToggle";
import TimerSettings from "./TimerSettings";
import MessageSettings from "./MessageSettings";
import AdvancedSettings from "./AdvancedSettings";
import StatusIndicator from "./StatusIndicator";

const SettingsPanel: React.FC = () => {
  return (
    <div className="w-80 bg-[#2D2D2D] border-r border-[#3D3D3D] flex flex-col">
      <div className="px-4 py-3 border-b border-[#3D3D3D] flex items-center justify-between">
        <h2 className="font-semibold">CURSOR AUTOMATION</h2>
        <div className="flex space-x-2">
          <button className="text-[#D4D4D4] hover:text-white focus:outline-none" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
          <button className="text-[#D4D4D4] hover:text-white focus:outline-none" title="More Actions">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="overflow-y-auto flex-1">
        <EnableToggle />
        <TimerSettings />
        <MessageSettings />
        <AdvancedSettings />
        <StatusIndicator />
      </div>
    </div>
  );
};

export default SettingsPanel;
