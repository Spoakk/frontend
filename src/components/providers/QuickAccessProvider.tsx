"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useQuickAccess } from "@/hooks/useQuickAccess";
import { useMultiTool } from "@/hooks/useMultiTool";

interface ToolWindow {
  id: string;
  tool: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface QuickAccessContextType {
  quickAccess: boolean;
  setQuickAccess: (value: boolean) => void;
  multiTool: boolean;
  setMultiTool: (value: boolean) => void;
  openTool: string | null;
  setOpenTool: (tool: string | null) => void;
  toolWindows: ToolWindow[];
  addToolWindow: (tool: string) => void;
  removeToolWindow: (id: string) => void;
  updateToolWindow: (id: string, updates: Partial<ToolWindow>) => void;
  bringToFront: (id: string) => void;
}

const QuickAccessContext = createContext<QuickAccessContextType | undefined>(undefined);

export function QuickAccessProvider({ children }: { children: ReactNode }) {
  const { quickAccess, setQuickAccess } = useQuickAccess();
  const { multiTool, setMultiTool } = useMultiTool();
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [toolWindows, setToolWindows] = useState<ToolWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const addToolWindow = (tool: string) => {
    const id = `${tool}-${Date.now()}`;
    const newWindow: ToolWindow = {
      id,
      tool,
      position: { 
        x: 50 + (toolWindows.length * 30), 
        y: 50 + (toolWindows.length * 30) 
      },
      size: { width: 800, height: 600 },
      zIndex: nextZIndex,
    };
    setToolWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const removeToolWindow = (id: string) => {
    setToolWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const updateToolWindow = (id: string, updates: Partial<ToolWindow>) => {
    setToolWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  };

  const bringToFront = (id: string) => {
    setToolWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((prev) => prev + 1);
  };

  return (
    <QuickAccessContext.Provider 
      value={{ 
        quickAccess, 
        setQuickAccess,
        multiTool,
        setMultiTool,
        openTool, 
        setOpenTool,
        toolWindows,
        addToolWindow,
        removeToolWindow,
        updateToolWindow,
        bringToFront,
      }}
    >
      {children}
    </QuickAccessContext.Provider>
  );
}

export function useQuickAccessContext() {
  const context = useContext(QuickAccessContext);
  if (!context) {
    throw new Error("useQuickAccessContext must be used within QuickAccessProvider");
  }
  return context;
}
