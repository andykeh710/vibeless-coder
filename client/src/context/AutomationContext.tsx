import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface AutomationState {
  enabled: boolean;
  interval: number;
  messageText: string;
  showNotifications: boolean;
  playSound: boolean;
  handleMultiCursor: boolean;
  cursorBehavior: string;
  timerId: NodeJS.Timeout | null;
  lastTriggered: Date | null;
  nextTriggerTime: Date | null;
}

interface AutomationContextType {
  state: AutomationState;
  toggleEnabled: () => void;
  setInterval: (interval: number) => void;
  incrementInterval: () => void;
  decrementInterval: () => void;
  setMessageText: (text: string) => void;
  toggleNotifications: () => void;
  togglePlaySound: () => void;
  toggleHandleMultiCursor: () => void;
  setCursorBehavior: (behavior: string) => void;
  triggerNow: () => void;
  resetTimer: () => void;
}

const defaultState: AutomationState = {
  enabled: false,
  interval: 5000,
  messageText: "Help me optimize this function for better performance.",
  showNotifications: true,
  playSound: false,
  handleMultiCursor: true,
  cursorBehavior: "stay",
  timerId: null,
  lastTriggered: null,
  nextTriggerTime: null,
};

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export function AutomationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AutomationState>(defaultState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.enabled && !state.timerId) {
      startTimer();
    } else if (!state.enabled && state.timerId) {
      stopTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.enabled, state.interval]);

  // Calculate next trigger time whenever lastTriggered changes
  useEffect(() => {
    if (state.lastTriggered && state.enabled) {
      const nextTime = new Date(state.lastTriggered.getTime() + state.interval);
      setState(prev => ({ ...prev, nextTriggerTime: nextTime }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lastTriggered]);

  const startTimer = () => {
    // Clear any existing timer
    if (state.timerId) {
      clearInterval(state.timerId);
    }

    // Start a new timer
    const id = setInterval(() => {
      triggerMessage();
    }, state.interval);

    setState(prev => ({ 
      ...prev, 
      timerId: id, 
      lastTriggered: new Date(),
      nextTriggerTime: new Date(Date.now() + state.interval)
    }));
  };

  const stopTimer = () => {
    if (state.timerId) {
      clearInterval(state.timerId);
      setState(prev => ({ 
        ...prev, 
        timerId: null,
        nextTriggerTime: null
      }));
    }
  };

  const triggerMessage = () => {
    // This is where the actual message would be inserted into the editor
    // In a real VS Code extension, this would call the editor API to insert text
    // For our web demo, we'll just show a notification
    
    if (state.showNotifications) {
      toast({
        title: "Message Inserted",
        description: "The configured message has been inserted at the cursor position.",
      });
    }

    setState(prev => ({ ...prev, lastTriggered: new Date() }));
  };

  const toggleEnabled = () => {
    setState(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const setInterval = (interval: number) => {
    if (interval < 500) interval = 500; // Minimum 500ms
    setState(prev => ({ ...prev, interval }));
  };

  const incrementInterval = () => {
    setState(prev => ({ ...prev, interval: prev.interval + 500 }));
  };

  const decrementInterval = () => {
    setState(prev => ({ 
      ...prev, 
      interval: Math.max(500, prev.interval - 500) 
    }));
  };

  const setMessageText = (messageText: string) => {
    setState(prev => ({ ...prev, messageText }));
  };

  const toggleNotifications = () => {
    setState(prev => ({ ...prev, showNotifications: !prev.showNotifications }));
  };

  const togglePlaySound = () => {
    setState(prev => ({ ...prev, playSound: !prev.playSound }));
  };

  const toggleHandleMultiCursor = () => {
    setState(prev => ({ ...prev, handleMultiCursor: !prev.handleMultiCursor }));
  };

  const setCursorBehavior = (cursorBehavior: string) => {
    setState(prev => ({ ...prev, cursorBehavior }));
  };

  const triggerNow = () => {
    triggerMessage();
  };

  const resetTimer = () => {
    if (state.enabled) {
      stopTimer();
      startTimer();
    }
  };

  return (
    <AutomationContext.Provider
      value={{
        state,
        toggleEnabled,
        setInterval,
        incrementInterval,
        decrementInterval,
        setMessageText,
        toggleNotifications,
        togglePlaySound,
        toggleHandleMultiCursor,
        setCursorBehavior,
        triggerNow,
        resetTimer,
      }}
    >
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error("useAutomation must be used within an AutomationProvider");
  }
  return context;
}
