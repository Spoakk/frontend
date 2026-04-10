"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { config } from "@/lib/config";

export type ApiStatus = "ok" | "error" | "unknown";

interface ApiStatusContextValue {
  status: ApiStatus;
  refresh: () => void;
}

const ApiStatusContext = createContext<ApiStatusContextValue>({
  status: "unknown",
  refresh: () => {},
});

export function useApiStatus() {
  return useContext(ApiStatusContext);
}

export function ApiStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ApiStatus>("unknown");

  const check = useCallback(() => {
    fetch(`${config.apiUrl}/health`, { signal: AbortSignal.timeout(5000) })
      .then(r => setStatus(r.ok ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [check]);

  return (
    <ApiStatusContext.Provider value={{ status, refresh: check }}>
      {children}
    </ApiStatusContext.Provider>
  );
}
