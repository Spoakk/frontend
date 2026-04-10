"use client";

import { useState, useEffect } from "react";
import { api, ServerStatus } from "@/lib/api";

export default function McPingWidget() {
  const [result, setResult] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");
    const port = params.get("port");

    if (!host) {
      setLoading(false);
      return;
    }

    const fetchServerStatus = async () => {
      try {
        const data = await api.mcping(host, port ? parseInt(port) : undefined);
        setResult(data);
      } catch (error) {
        console.error("Failed to fetch server status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServerStatus();

    // 10 dakika (600000ms)
    const interval = setInterval(fetchServerStatus, 600000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[120px] bg-[#0c0c0f] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[120px] bg-[#0c0c0f] flex items-center justify-center p-4">
        <p className="text-zinc-500 text-sm">Failed to load server status</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[120px] bg-[#0c0c0f] p-4">
      <div className="flex items-center gap-4 h-full">
        <div className="shrink-0">
          {result.favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.favicon}
              alt="Server icon"
              className="h-16 w-16 rounded-lg"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate mb-1.5">
            {result.host}
          </h3>

          <div className="flex items-center gap-3 text-xs">
            {result.online && result.players_online !== null && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-400">
                  {result.players_online}/{result.players_max} players
                </span>
              </div>
            )}
            {result.online && (
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 font-mono">
                  {result.latency_ms}ms
                </span>
              </div>
            )}
            {!result.online && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="text-red-400">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <a
        href="https://spoak.cc"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 flex items-center gap-1 text-zinc-600 hover:text-white transition-colors group"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/spoak.svg" alt="Spoak" className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="text-[10px]">powered by Spoak</span>
      </a>
    </div>
  );
}
