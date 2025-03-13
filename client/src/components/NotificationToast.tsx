import React, { useState, useEffect } from 'react';

interface NotificationToastProps {
  title: string;
  description: string;
  timestamp: Date;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  description,
  timestamp
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide notification after 5 seconds
    const timerId = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timerId);
  }, [timestamp]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-[#264F78] border border-[#007ACC] rounded shadow-lg p-3 flex items-start max-w-sm z-10">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2 text-[#007ACC] mt-0.5" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 2 h1 a9 9 0 0 1 9 9 v1 a9 9 0 0 1 -9 9 h-1 a9 9 0 0 1 -9 -9 v-1 a9 9 0 0 1 9 -9 z"></path>
        <circle cx="8" cy="9" r="1"></circle>
        <circle cx="16" cy="9" r="1"></circle>
        <path d="M7 13h10a4 4 0 0 1 0 6H7a4 4 0 0 1 0 -6z"></path>
      </svg>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs mt-1">{description}</div>
      </div>
      <button 
        className="ml-2 text-[#D4D4D4] hover:text-white focus:outline-none" 
        onClick={() => setVisible(false)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast;
