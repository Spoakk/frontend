"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api, ServerStatus } from "@/lib/api";
import { IconSpinner, IconCode } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/Card";
import WidgetModal from "@/components/mcping/WidgetModal";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-white truncate">{value}</p>
    </div>
  );
}

export default function McPingPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const lastColon = raw.lastIndexOf(":");
    let host = raw;
    let port: number | undefined;
    if (lastColon > 0 && lastColon < raw.length - 1) {
      const maybePort = parseInt(raw.slice(lastColon + 1), 10);
      if (!isNaN(maybePort)) { host = raw.slice(0, lastColon); port = maybePort; }
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await api.mcping(host, port);
      setResult(data);
    } catch (err) { 
      const message = err instanceof Error ? err.message : t("mcping.errorBackend");
      setError(message);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("mcping.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("mcping.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("mcping.description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t("mcping.placeholder")}
            className="flex-1 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
          <Button variant="primaryNormal" type="submit" disabled={loading || !input.trim()}>
            {loading ? <><IconSpinner />{t("mcping.pinging")}</> : t("mcping.pingBtn")}
          </Button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >{error}</motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className={`flex items-center gap-3 rounded-xl border px-5 py-4 ${result.online ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${result.online ? "bg-emerald-400" : "bg-red-400"}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{result.online ? t("mcping.online") : t("mcping.offline")}</p>
                  <p className="text-xs text-zinc-500">{result.host}:{result.port}</p>
                </div>
                <div className="flex items-center gap-2">
                  {result.online && <span className="text-xs text-zinc-500 font-mono">{result.latency_ms}ms</span>}
                  <button
                    onClick={() => setWidgetModalOpen(true)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:bg-white/10 hover:text-emerald-400 transition-all flex items-center gap-1.5"
                  >
                    <IconCode className="h-3 w-3" />
                    {t("mcping.showWidget")}
                  </button>
                </div>
              </div>

              {result.online && (
                <>
                  {(result.favicon || result.description) && (
                    <SectionCard bodyClassName="px-5 py-4">
                      <div className="flex items-start gap-4">
                        {result.favicon && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={result.favicon} alt="Server icon" className="h-16 w-16 rounded-lg shrink-0" style={{ imageRendering: "pixelated" }} />
                        )}
                        {result.description && (
                          <p className="text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">{result.description}</p>
                        )}
                      </div>
                    </SectionCard>
                  )}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {result.players_online !== null && <StatCard label={t("mcping.players")} value={`${result.players_online} / ${result.players_max}`} />}
                    {result.version && <StatCard label={t("mcping.version")} value={result.version} />}
                    {result.software && <StatCard label={t("mcping.software")} value={result.software} />}
                    {result.protocol !== null && <StatCard label={t("mcping.protocol")} value={result.protocol!} />}
                    <StatCard label={t("mcping.latency")} value={`${result.latency_ms}ms`} />
                  </div>
                  {result.players.length > 0 && (
                    <SectionCard bodyClassName="px-5 py-4">
                      <p className="text-xs font-medium text-zinc-400 mb-3">{t("mcping.onlinePlayers")}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.players.map((name) => (
                          <span key={name} className="rounded-md bg-white/5 border border-white/8 px-2.5 py-1 text-xs text-zinc-300">{name}</span>
                        ))}
                      </div>
                    </SectionCard>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <WidgetModal
          open={widgetModalOpen}
          onClose={() => setWidgetModalOpen(false)}
          result={result}
        />
      </motion.div>
    </div>
  );
}
