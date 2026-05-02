"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TOOLS, QUICK_LINK_KEYS } from "@/lib/tools";
import { IconStarFilled } from "@/components/ui/Icons";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, type: "spring", stiffness: 50, damping: 16 },
});

const quickLinks = TOOLS.filter(t => (QUICK_LINK_KEYS as readonly string[]).includes(t.key));

function GitHubStars() {
  const [stars, setStars] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("https://api.github.com/repos/Spoakk/frontend")
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || stars === null) return null;

  return (
    <motion.a
      href="https://github.com/Spoakk/frontend"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
    >
      <IconStarFilled className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span>{stars.toLocaleString()}</span>
    </motion.a>
  );
}

export default function HeroSection() {
  const { t: rawT } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const t = (key: string) => mounted ? rawT(key) : "";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 pt-24 md:pt-20">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.08] blur-[140px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute left-1/4 top-2/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-600/[0.05] blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-teal-500/[0.05] blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0c0c0f] via-[#0c0c0f]/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">

        <motion.div {...fadeUp(0)} className="mb-10 flex justify-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm shadow-lg shadow-emerald-500/5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" aria-hidden="true" />
            {t("hero.badge")}
          </span>
          <GitHubStars />
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1] mb-1"
        >
          {t("hero.title")}{" "}
          <span className="relative inline-block">
            <span className="text-emerald-400">{t("hero.titleHighlight")}</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1 origin-left bg-gradient-to-r from-emerald-500/80 via-emerald-400/60 to-teal-400/40 rounded-full"
            />
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.18)}
          className="mt-8 max-w-2xl mx-auto text-lg text-zinc-400 sm:text-xl leading-relaxed"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          {...fadeUp(0.28)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
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
          className="mt-20 grid grid-cols-2 gap-3 sm:grid-cols-4 items-stretch"
        >
          {quickLinks.map((tool, i) => (
            <motion.div
              key={tool.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08, duration: 0.6, type: "spring", stiffness: 70 }}
            >
              <Card href={tool.href} glow className="h-full p-5 hover:scale-[1.02] transition-transform duration-300">
                <div className="relative flex flex-col">
                  <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-zinc-400 group-hover:border-emerald-500/30 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 group-hover:text-emerald-400 transition-all duration-300 shadow-sm">
                    {tool.icon}
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors duration-200 leading-snug mb-1.5">
                    {t(`nav.${tool.key}`)}
                  </p>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-200 leading-relaxed line-clamp-2">
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
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-20 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-zinc-700">
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-zinc-700/80 to-transparent animate-pulse" style={{ animationDuration: "2s" }} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
