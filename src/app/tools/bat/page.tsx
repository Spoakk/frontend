"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/Card";
const SERVER_TYPES = ["Paper", "Leaf"] as const;
type ServerType = (typeof SERVER_TYPES)[number];

const JAR_NAMES: Record<ServerType, string> = {
  Paper: "paper.jar",
  Leaf: "leaf.jar",
};

const AIKAR_FLAGS = [
  "-XX:+UseG1GC", "-XX:+ParallelRefProcEnabled", "-XX:MaxGCPauseMillis=200",
  "-XX:+UnlockExperimentalVMOptions", "-XX:+DisableExplicitGC", "-XX:+AlwaysPreTouch",
  "-XX:G1NewSizePercent=30", "-XX:G1MaxNewSizePercent=40", "-XX:G1HeapRegionSize=8M",
  "-XX:G1ReservePercent=20", "-XX:G1HeapWastePercent=5", "-XX:G1MixedGCCountTarget=4",
  "-XX:InitiatingHeapOccupancyPercent=15", "-XX:G1MixedGCLiveThresholdPercent=90",
  "-XX:G1RSetUpdatingPauseTimePercent=5", "-XX:SurvivorRatio=32",
  "-XX:+PerfDisableSharedMem", "-XX:MaxTenuringThreshold=1",
  "-Dusing.aikars.flags=https://mcflags.emc.gs", "-Daikars.new.flags=true",
];

function generateBat(type: ServerType, ram: number, jar: string): string {
  const flags = AIKAR_FLAGS.join(" ");
  return [
    "@echo off",
    `java -Xms${ram}M -Xmx${ram}M ${flags} -jar ${jar} --nogui`,
    "pause",
  ].join("\r\n");
}

function downloadBat(content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "start.bat";
  a.click();
  URL.revokeObjectURL(url);
}

export default function BatPage() {
  const { t } = useTranslation();
  const [serverType, setServerType] = useState<ServerType>("Paper");
  const [ram, setRam] = useState(2048);

  const jarName = JAR_NAMES[serverType];
  const batContent = generateBat(serverType, ram, jarName);
  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("bat.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("bat.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("bat.description")}</p>
        </div>

        <SectionCard className="mt-0 mb-5" bodyClassName="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">{t("bat.serverType")}</label>
            <div className="flex gap-2">
              {SERVER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setServerType(type)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    serverType === type
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-zinc-400">{t("bat.ram")}</label>
              <span className="text-xs font-mono text-emerald-400">{ram >= 1024 ? `${ram / 1024}GB` : `${ram}MB`}</span>
            </div>
            <input
              type="range" min={512} max={16384} step={512} value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>512MB</span><span>16GB</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="mt-5"
          header={
            <>
              <span className="text-xs text-zinc-500 font-mono">{t("bat.preview")}</span>
              <CopyButton textToCopy={batContent} className="text-xs text-zinc-500 hover:text-white transition-colors">
                {t("common.copy")}
              </CopyButton>
            </>
          }
          bodyClassName="p-0"
        >
          <pre className="px-4 py-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {batContent}
          </pre>
        </SectionCard>

        <Button
          variant="primary"
          onClick={() => downloadBat(batContent)}
          className="mt-4 w-full"
        >
          {t("bat.downloadBtn")}
        </Button>
      </motion.div>
    </div>
  );
}
