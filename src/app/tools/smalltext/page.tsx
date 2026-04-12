"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toSmallText } from "@/lib/smalltext";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/Card";

export default function SmallTextPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState("Hello World");
  const [capitalizeFirst, setCapitalizeFirst] = useState(false);
  const output = useMemo(() => toSmallText(input, capitalizeFirst), [input, capitalizeFirst]);

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("smalltext.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("smalltext.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("smalltext.description")}</p>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <button role="switch" aria-checked={capitalizeFirst} onClick={() => setCapitalizeFirst((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${capitalizeFirst ? "bg-emerald-500" : "bg-white/10"}`}
          >
            <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${capitalizeFirst ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <div>
            <p className="text-sm text-white">{t("smalltext.toggleLabel")}</p>
            <p className="text-xs text-zinc-500">{t("smalltext.toggleDesc")}</p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-zinc-400 mb-2">{t("smalltext.inputLabel")}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
            className="w-full rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
            placeholder="Type something..."
          />
        </div>

        <SectionCard
          className="mb-0"
          header={
            <>
              <span className="text-xs text-zinc-500">{t("smalltext.outputLabel")}</span>
              <CopyButton textToCopy={output} disabled={!output}
                className="text-xs text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
                successMessage={t("common.copied")}
              >
                {t("common.copy")}
              </CopyButton>
            </>
          }
          bodyClassName="px-5 py-5 min-h-[64px]"
        >
          <p className="text-base text-white leading-relaxed break-all select-all">
            {output || <span className="text-zinc-600">{t("smalltext.outputPlaceholder")}</span>}
          </p>
        </SectionCard>

        <details className="mt-6 group">
          <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300 transition-colors list-none flex items-center gap-1">
            <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {t("smalltext.charMap")}
          </summary>
          <SectionCard className="mt-3" bodyClassName="p-4">
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 text-xs font-mono text-center">
              {Object.entries({a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"ѕ",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"}).map(([from, to]) => (
                <div key={from} className="flex flex-col items-center gap-0.5">
                  <span className="text-zinc-500">{from}</span>
                  <span className="text-white">{to}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </details>
      </motion.div>
    </div>
  );
}
