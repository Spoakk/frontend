"use client";

import { useState } from "react";

const STORAGE_KEY = "spoak_multi_tool";

export function useMultiTool() {
  const [multiTool, setMultiToolState] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  });

  const setMultiTool = (value: boolean) => {
    setMultiToolState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  };

  return { multiTool, setMultiTool };
}
