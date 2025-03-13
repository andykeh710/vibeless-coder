import React from "react";
import { useAutomation } from "@/context/AutomationContext";

const TimerSettings: React.FC = () => {
  const { state, setInterval, incrementInterval, decrementInterval, toggleNotifications, togglePlaySound } = useAutomation();

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 500) {
      setInterval(value);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-[#3D3D3D]">
      <h3 className="font-semibold mb-2">Timer Configuration</h3>
      
      <div className="mb-3">
        <label htmlFor="interval" className="block text-sm mb-1">Interval (ms)</label>
        <div className="flex">
          <input 
            type="number" 
            id="interval" 
            min="500" 
            step="500" 
            value={state.interval}
            onChange={handleIntervalChange}
            className="w-full bg-[#1F1F1F] border border-[#3D3D3D] rounded px-2 py-1 text-sm focus:border-[#007ACC] focus:outline-none"
          />
          <div className="flex flex-col ml-1">
            <button 
              className="bg-[#1F1F1F] hover:bg-[#2A2D2E] border border-[#3D3D3D] px-1 text-xs rounded-t"
              onClick={incrementInterval}
              title="Increase interval"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button 
              className="bg-[#1F1F1F] hover:bg-[#2A2D2E] border border-[#3D3D3D] border-t-0 px-1 text-xs rounded-b"
              onClick={decrementInterval}
              title="Decrease interval"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-[#D4D4D4] opacity-70 mt-1">
          Time between automatic message insertions
        </p>
      </div>
      
      <div className="flex items-center mb-3">
        <input 
          type="checkbox" 
          id="showNotification" 
          checked={state.showNotifications}
          onChange={toggleNotifications}
          className="mr-2 h-4 w-4 bg-[#1F1F1F] border border-[#3D3D3D] rounded" 
        />
        <label htmlFor="showNotification" className="text-sm">Show notifications</label>
      </div>
      
      <div className="flex items-center">
        <input 
          type="checkbox" 
          id="playSound" 
          checked={state.playSound}
          onChange={togglePlaySound}
          className="mr-2 h-4 w-4 bg-[#1F1F1F] border border-[#3D3D3D] rounded"
        />
        <label htmlFor="playSound" className="text-sm">Play sound on send</label>
      </div>
    </div>
  );
};

export default TimerSettings;
