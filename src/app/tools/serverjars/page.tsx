"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api, JarVersion } from "@/lib/api";
import Select from "@/components/ui/Select";
import { IconDownload, IconSpinner } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/Card";

const SERVER_TYPES = ["Paper", "Leaf"] as const;
type ServerType = (typeof SERVER_TYPES)[number];
const INITIAL_VISIBLE = 10;

function Badge({ channel }: { channel: string }) {
  const color =
    channel === "stable" || channel === "default" ? "bg-emerald-500/10 text-emerald-400" :
    channel === "beta" ? "bg-blue-500/10 text-blue-400" :
    "bg-amber-500/10 text-amber-400";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{channel}</span>;
}

export default function ServerJarsPage() {
  const { t } = useTranslation();
  const [serverType, setServerType] = useState<ServerType>("Paper");
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [builds, setBuilds] = useState<JarVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [loadingBuilds, setLoadingBuilds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchVersions = useCallback(async () => {
    setLoadingVersions(true); setError(null); setVersions([]); setBuilds([]); setSelectedVersion(""); setExpanded(false);
    try {
      const data = await api.versions();
      setVersions(data.versions);
      if (data.versions.length > 0) setSelectedVersion(data.versions[0]);
    } catch { setError(t("serverjars.errorVersions")); }
    finally { setLoadingVersions(false); }
  }, [t]);

  const fetchBuilds = useCallback(async (type: ServerType, version: string) => {
    if (!version) return;
    setLoadingBuilds(true); setError(null); setBuilds([]); setExpanded(false);
    try {
      const data = type === "Paper" ? await api.paper.builds(version) : await api.leaf.builds(version);
      setBuilds(data.builds);
    } catch { setError(t("serverjars.errorBuilds")); }
    finally { setLoadingBuilds(false); }
  }, [t]);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);
  useEffect(() => { setBuilds([]); setExpanded(false); }, [serverType]);
  useEffect(() => { if (selectedVersion) fetchBuilds(serverType, selectedVersion); }, [selectedVersion, serverType, fetchBuilds]);

  const visibleBuilds = expanded ? builds : builds.slice(0, INITIAL_VISIBLE);
  const hasMore = builds.length > INITIAL_VISIBLE;
  const buildCount = `${builds.length} ${builds.length !== 1 ? t("serverjars.buildsPlural") : t("serverjars.builds")}`;

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("serverjars.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("serverjars.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("serverjars.description")}</p>
        </div>

        <div className="flex gap-2 mb-5">
          {SERVER_TYPES.map((type) => (
            <button key={type} onClick={() => setServerType(type)}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                serverType === type ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:text-white"
              }`}
            >{type}</button>
          ))}
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-zinc-400 mb-2">{t("serverjars.versionLabel")}</label>
          {loadingVersions ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500"><IconSpinner />{t("serverjars.loadingVersions")}</div>
          ) : (
            <Select
              value={selectedVersion}
              onChange={setSelectedVersion}
              options={versions.map((v) => ({ value: v, label: v }))}
              disabled={versions.length === 0}
              placeholder={t("serverjars.loadingVersions")}
            />
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >{error}</motion.div>
          )}
        </AnimatePresence>

        <SectionCard
          header={
            <>
              <span className="text-xs font-medium text-zinc-400">
                {loadingBuilds ? t("serverjars.loadingBuilds") : buildCount}
              </span>
              {selectedVersion && <span className="text-xs text-zinc-600 font-mono">{serverType} {selectedVersion}</span>}
            </>
          }
          bodyClassName="p-0"
        >
          {loadingBuilds ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500"><IconSpinner />{t("serverjars.loadingBuilds")}</div>
          ) : builds.length === 0 && !error ? (
            <div className="py-12 text-center text-sm text-zinc-600">{t("serverjars.noBuilds")}</div>
          ) : (
            <div className="relative">
              <ul className="divide-y divide-white/5">
                {visibleBuilds.map((build, i) => (
                  <motion.li key={`${build.version}-${build.build}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 9) * 0.03 }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white">Build #{build.build}</span>
                      <Badge channel={build.channel} />
                    </div>
                    <a href={build.download_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md border border-white/8 px-3 py-1.5 text-xs text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                    >
                      <IconDownload />{t("common.download")}
                    </a>
                  </motion.li>
                ))}
              </ul>
              {hasMore && !expanded && (
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 pt-16"
                  style={{ background: "linear-gradient(to bottom, transparent, #0d0d10 70%)" }}
                >
                  <Button variant="secondary" onClick={() => setExpanded(true)}>
                    {t("serverjars.seeAll", { count: builds.length })}
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {expanded && hasMore && (
          <Button variant="secondary" onClick={() => { setExpanded(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="mt-3 w-full"
          >
            {t("serverjars.showLess")}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
