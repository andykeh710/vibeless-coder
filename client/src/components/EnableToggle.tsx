import React from "react";
import { useAutomation } from "@/context/AutomationContext";

const EnableToggle: React.FC = () => {
  const { state, toggleEnabled } = useAutomation();

  return (
    <div className="px-4 py-3 border-b border-[#3D3D3D]">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold">Automation Enabled</label>
        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
          <input 
            type="checkbox" 
            name="toggle" 
            id="toggle"
            checked={state.enabled}
            onChange={toggleEnabled}
            className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-[#007ACC] ${state.enabled ? 'border-[#007ACC]' : 'border-[#505050]'}`}
            style={{ top: '0', transition: 'all 0.2s ease' }}
          />
          <label 
            htmlFor="toggle"
            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${state.enabled ? 'bg-[#007ACC]' : 'bg-[#505050]'}`}
            style={{ transition: 'background-color 0.2s ease' }}
          />
        </div>
      </div>
      <p className="text-xs text-[#D4D4D4] opacity-70 mt-1">
        Toggle to enable or disable automated message sending
      </p>
    </div>
  );
};

export default EnableToggle;
