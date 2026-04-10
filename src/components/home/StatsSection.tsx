"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TOOLS } from "@/lib/tools";

const STATS_KEYS = [
  { value: String(TOOLS.length), labelKey: "stats.toolsLabel" },
  { valueKey: "stats.freeValue",  labelKey: "stats.freeLabel" },
  { valueKey: "stats.loginValue", labelKey: "stats.loginLabel" },
] as const;

export default function StatsSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {STATS_KEYS.map((stat, i) => {
              const value = "value" in stat ? stat.value : (mounted ? t(stat.valueKey) : "");
              const label = mounted ? t(stat.labelKey) : "";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 50 }}
                  className="group flex flex-col items-center justify-center p-10 text-center transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  <div className="text-4xl font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:-translate-y-1">
                    {value}
                  </div>
                  <div className="mt-3 text-xs font-semibold tracking-widest uppercase text-zinc-500 transition-colors group-hover:text-zinc-400">
                    {label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
