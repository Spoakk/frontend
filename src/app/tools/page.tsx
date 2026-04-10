"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ToolGrid from "@/components/ui/ToolGrid";

export default function ToolsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t("nav.tools")}
            </span>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{t("features.title")}</h1>
            <p className="mt-2 text-zinc-400 max-w-2xl">{t("features.subtitle")}</p>
          </div>
          <ToolGrid animate="mount" iconSize="md" />
        </motion.div>
      </div>
    </main>
  );
}
