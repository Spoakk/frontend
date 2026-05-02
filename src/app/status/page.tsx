"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { config } from "@/lib/config";
import { useApiStatus } from "@/components/providers/ApiStatusProvider";
import { SectionCard } from "@/components/ui/Card";

type Status = "checking" | "ok" | "error";

interface ServiceCheck {
  key: string;
  url: string;
  validate?: (data: unknown, res?: Response) => boolean;
}

const SERVICES: ServiceCheck[] = [
  {
    key: "health",
    url: "/health",
    validate: (d) => (d as { status?: string })?.status === "ok",
  },
  {
    key: "versions",
    url: "/serverjars/versions",
    validate: (d) => Array.isArray((d as { versions?: unknown[] })?.versions) && ((d as { versions?: unknown[] })?.versions?.length ?? 0) > 0,
  },
  {
    key: "paper",
    url: "/serverjars/paper/1.21.1/builds",
    validate: (d) => Array.isArray((d as { builds?: unknown[] })?.builds),
  },
  {
    key: "leaf",
    url: "/serverjars/leaf/1.21.4/builds",
    validate: (d) => Array.isArray((d as { builds?: unknown[] })?.builds),
  },
  {
    key: "mcping",
    url: "/mcping?host=mc.hypixel.net&port=25565",
    validate: (d) => typeof (d as { online?: unknown })?.online === "boolean",
  },
  {
    key: "seedmap",
    url: "/seedmap/tile?seed=0&x=0&z=0&size=32&version=1.21",
    validate: (_d, res) =>
      !!res?.ok && res.headers.get("content-type") === "application/octet-stream",
  },
];

interface CheckResult {
  status: Status;
  latency: number | null;
  error?: string;
}

async function checkService(svc: ServiceCheck): Promise<CheckResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${config.apiUrl}${svc.url}`, {
      signal: AbortSignal.timeout(8000),
    });
    const latency = Date.now() - start;
    if (!res.ok) return { status: "error", latency, error: `HTTP ${res.status}` };

    if (svc.validate) {
      let data: unknown = null;
      if ((res.headers.get("content-type") ?? "").includes("json")) {
        data = await res.json();
      }
      const ok = svc.validate(data, res);
      return { status: ok ? "ok" : "error", latency, error: ok ? undefined : "Unexpected response" };
    }
    return { status: "ok", latency };
  } catch (e) {
    return { status: "error", latency: Date.now() - start, error: (e as Error)?.message ?? "Timeout" };
  }
}

function StatusDot({ status }: { status: Status }) {
  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${status === "ok" ? "bg-emerald-400" :
      status === "error" ? "bg-red-500" :
        "bg-zinc-600 animate-pulse"
      }`} />
  );
}

function LatencyBadge({ ms }: { ms: number | null }) {
  if (ms === null) return null;
  const color = ms < 300 ? "text-emerald-400" : ms < 800 ? "text-yellow-400" : "text-red-400";
  return <span className={`text-xs font-mono ${color}`}>{ms}ms</span>;
}

export default function StatusPage() {
  const { t } = useTranslation();
  const { refresh: refreshHealth } = useApiStatus();
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runChecks = useCallback(async () => {
    const init: Record<string, CheckResult> = {};
    SERVICES.forEach(s => { init[s.key] = { status: "checking", latency: null }; });
    setResults(init);

    const entries = await Promise.all(
      SERVICES.map(async svc => [svc.key, await checkService(svc)] as const)
    );
    setResults(Object.fromEntries(entries));
    setLastChecked(new Date());
    refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    startTransition(() => { runChecks(); });
    const interval = setInterval(() => startTransition(() => { runChecks(); }), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [runChecks]);

  const values = Object.values(results);
  const allOk = values.length > 0 && values.every(r => r.status === "ok");
  const anyError = values.some(r => r.status === "error");
  const overallStatus: Status =
    values.length === 0 ? "checking" :
      anyError ? "error" :
        allOk ? "ok" : "checking";

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("status.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("status.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("status.description")}</p>
        </div>

        <div className={`rounded-xl border px-5 py-4 mb-6 flex items-center gap-3 ${overallStatus === "ok" ? "border-emerald-500/30 bg-emerald-500/10" :
          overallStatus === "error" ? "border-red-500/30 bg-red-500/10" :
            "border-white/8 bg-white/[0.02]"
          }`}>
          <StatusDot status={overallStatus} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${overallStatus === "ok" ? "text-emerald-400" :
              overallStatus === "error" ? "text-red-400" :
                "text-zinc-400"
              }`}>
              {overallStatus === "ok" ? t("status.allOperational") :
                overallStatus === "error" ? t("status.degraded") :
                  t("status.checking")}
            </p>
            {lastChecked && (
              <p className="text-xs text-zinc-600 mt-0.5">
                {t("status.lastChecked")} {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {SERVICES.map((svc, i) => {
            const result = results[svc.key];
            return (
              <motion.div
                key={svc.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <SectionCard bodyClassName="px-4 py-3.5">
                  <div className="flex items-center gap-4">
                    <StatusDot status={result?.status ?? "checking"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {t(`status.services.${svc.key}.label`)}
                      </p>
                      <p className="text-xs text-zinc-600 truncate">
                        {t(`status.services.${svc.key}.description`)}
                      </p>
                      {result?.error && (
                        <p className="text-xs text-red-400 mt-0.5">{result.error}</p>
                      )}
                    </div>
                    <LatencyBadge ms={result?.latency ?? null} />
                  </div>
                </SectionCard>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          {t("status.autoRefresh")}
        </p>

      </motion.div>
    </div>
  );
}
