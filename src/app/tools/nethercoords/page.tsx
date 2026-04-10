"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/Card";

function CoordField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-lg border border-white/8 bg-[#0c0c0f] px-3 py-2.5 text-sm text-white placeholder-zinc-700 focus:border-emerald-500/40 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}

function ResultRow({ labelX, labelZ, x, z, copyText, copyLabel }: {
  labelX: string; labelZ: string;
  x: number | null; z: number | null;
  copyText: string; copyLabel: string;
}) {
  const empty = x === null && z === null;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.025] px-5 py-4">
      <div className="flex gap-5 flex-1">
        <div>
          <p className="text-[11px] text-zinc-600 mb-0.5">{labelX}</p>
          <p className={`text-xl font-bold font-mono ${empty ? "text-zinc-700" : "text-white"}`}>
            {empty ? "—" : x ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-zinc-600 mb-0.5">{labelZ}</p>
          <p className={`text-xl font-bold font-mono ${empty ? "text-zinc-700" : "text-white"}`}>
            {empty ? "—" : z ?? "—"}
          </p>
        </div>
      </div>
      {!empty && (
        <CopyButton textToCopy={copyText} className="shrink-0 rounded-md border border-white/8 px-3 py-1.5 text-xs text-zinc-400 hover:border-white/20 hover:text-white transition-colors">
          {copyLabel}
        </CopyButton>
      )}
    </div>
  );
}

export default function NetherCoordsPage() {
  const { t } = useTranslation();
  const [owX, setOwX] = useState("");
  const [owZ, setOwZ] = useState("");
  const [nX, setNX] = useState("");
  const [nZ, setNZ] = useState("");

  const owToN = {
    x: owX !== "" && !isNaN(+owX) ? Math.round(+owX / 8) : null,
    z: owZ !== "" && !isNaN(+owZ) ? Math.round(+owZ / 8) : null,
  };
  const nToOw = {
    x: nX !== "" && !isNaN(+nX) ? Math.round(+nX * 8) : null,
    z: nZ !== "" && !isNaN(+nZ) ? Math.round(+nZ * 8) : null,
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("nethercoords.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("nethercoords.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("nethercoords.description")}</p>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🌍</span>
            <p className="text-sm font-semibold text-white">{t("nethercoords.overworld")}</p>
            <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-base">🔥</span>
            <p className="text-sm font-semibold text-white">{t("nethercoords.nether")}</p>
          </div>
          <SectionCard bodyClassName="p-4 space-y-3">
            <div className="flex gap-3">
              <CoordField label={t("nethercoords.coordX")} value={owX} onChange={setOwX} />
              <CoordField label={t("nethercoords.coordZ")} value={owZ} onChange={setOwZ} />
            </div>
            <ResultRow
              labelX={t("nethercoords.netherX")} labelZ={t("nethercoords.netherZ")}
              x={owToN.x} z={owToN.z}
              copyText={`X: ${owToN.x ?? "?"} Z: ${owToN.z ?? "?"}`}
              copyLabel={t("nethercoords.copy")}
            />
          </SectionCard>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-xs text-zinc-700 font-mono">8:1</span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔥</span>
            <p className="text-sm font-semibold text-white">{t("nethercoords.nether")}</p>
            <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-base">🌍</span>
            <p className="text-sm font-semibold text-white">{t("nethercoords.overworld")}</p>
          </div>
          <SectionCard bodyClassName="p-4 space-y-3">
            <div className="flex gap-3">
              <CoordField label={t("nethercoords.coordX")} value={nX} onChange={setNX} />
              <CoordField label={t("nethercoords.coordZ")} value={nZ} onChange={setNZ} />
            </div>
            <ResultRow
              labelX={t("nethercoords.overworldX")} labelZ={t("nethercoords.overworldZ")}
              x={nToOw.x} z={nToOw.z}
              copyText={`X: ${nToOw.x ?? "?"} Z: ${nToOw.z ?? "?"}`}
              copyLabel={t("nethercoords.copy")}
            />
          </SectionCard>
        </div>

        <details className="mt-6 group">
          <summary className="cursor-pointer text-xs text-zinc-600 hover:text-zinc-400 transition-colors list-none flex items-center gap-1.5">
            <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {t("nethercoords.howItWorks")}
          </summary>
          <div className="mt-3 rounded-xl border border-white/6 bg-white/[0.015] p-4 text-xs text-zinc-600 space-y-1.5">
            <p>{t("nethercoords.howDesc")}</p>
            <p className="font-mono">{t("nethercoords.formulaOwToN")}</p>
            <p className="font-mono">{t("nethercoords.formulaNToOw")}</p>
            <p>{t("nethercoords.yNote")}</p>
          </div>
        </details>

      </motion.div>
    </div>
  );
}
