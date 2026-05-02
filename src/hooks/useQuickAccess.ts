"use client";

import { useState } from "react";

const STORAGE_KEY = "spoak-quick-access";

export function useQuickAccess() {
  const [quickAccess, setQuickAccessState] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  });

  const setQuickAccess = (value: boolean) => {
    setQuickAccessState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  };

  return { quickAccess, setQuickAccess };
}
