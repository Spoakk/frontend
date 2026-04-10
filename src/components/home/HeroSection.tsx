"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TOOLS, QUICK_LINK_KEYS } from "@/lib/tools";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, type: "spring", stiffness: 50, damping: 16 },
});

const quickLinks = TOOLS.filter(t => (QUICK_LINK_KEYS as readonly string[]).includes(t.key));

export default function HeroSection() {
  const { t: rawT } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const t = (key: string) => mounted ? rawT(key) : "";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 pt-20 md:pt-16">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="absolute left-1/4 top-2/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-emerald-600/[0.04] blur-[80px]" />
        <div className="absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-teal-500/[0.04] blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c0c0f] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">

        <motion.div {...fadeUp(0)} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.12]"
        >
          {t("hero.title")}{" "}
          <span className="relative inline-block">
            <span className="text-emerald-400">{t("hero.titleHighlight")}</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-px origin-left bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-transparent"
            />
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.18)}
          className="mt-7 max-w-lg mx-auto text-base text-zinc-400 sm:text-lg leading-relaxed"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          {...fadeUp(0.28)}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button variant="primary" href="/tools/serverjars">
            {t("hero.cta")}
          </Button>
          <Button variant="secondary" href="/tools/mcping">
            {t("hero.ctaSecondary")}
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp(0.4)}
          className="mt-16 grid grid-cols-2 gap-2.5 sm:grid-cols-4 items-stretch"
        >
          {quickLinks.map((tool, i) => (
            <motion.div
              key={tool.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.5, type: "spring", stiffness: 60 }}
            >
              <Card href={tool.href} glow className="h-full p-4">
                <div className="relative flex flex-col">
                  <div className="mb-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all duration-300">
                    {tool.icon}
                  </div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors duration-200 leading-snug">
                    {t(`nav.${tool.key}`)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors duration-200 leading-snug line-clamp-2">
                    {t(`quickLinks.${tool.key}`)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex flex-col items-center gap-1.5 text-zinc-700">
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent animate-pulse" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
