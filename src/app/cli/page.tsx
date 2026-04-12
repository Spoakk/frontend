"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Card, SectionCard } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  IconTerminal, IconDownload, IconServerJars,
  IconArrowRight, IconGithub, IconWifi, IconPlayerProfile,
} from "@/components/ui/Icons";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, type: "spring", stiffness: 55, damping: 16 },
});

function CliText() {
  const [hovered, setHovered] = React.useState(false);
  const letters = ["C", "L", "I"];

  return (
    <span
      className="relative inline-flex items-baseline gap-[0.02em] cursor-default select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 -z-10 rounded-lg blur-xl"
        animate={{
          background: hovered
            ? "radial-gradient(ellipse at center, rgba(124,90,243,0.35) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(124,90,243,0.12) 0%, transparent 70%)",
          scale: hovered ? 1.3 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block font-bold"
          initial={{ opacity: 0, y: 24, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: 0.15 + i * 0.08,
            duration: 0.5,
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
          style={{
            background: "linear-gradient(135deg, #a78bfa, #7c5af3, #c4b5fd)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: hovered ? "drop-shadow(0 0 8px rgba(124,90,243,0.7))" : "none",
          }}
        >
          {letter}
        </motion.span>
      ))}

      <motion.span
        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-violet-500/0 via-violet-400 to-violet-500/0"
        animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      />
    </span>
  );
}

export default function CliPage() {
  const { t: rawT } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const t = (k: string) => mounted ? rawT(k) : "";

  const installCmd = "iwr -useb https://raw.githubusercontent.com/Spoakk/cli/main/install.ps1 | iex";

  const features = [
    { icon: <IconServerJars className="h-5 w-5" />, key: "runtime" },
    { icon: <IconDownload className="h-5 w-5" />,   key: "updates" },
  ];

  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-[120px]" />
      </div>

      <motion.div {...fadeUp(0)} className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/[0.08] px-3 py-1 text-xs font-medium text-violet-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          {t("cli.badge")}
        </span>
      </motion.div>

      <motion.h1 {...fadeUp(0.06)} className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {t("cli.title")}{" "}
        <CliText />
      </motion.h1>

      <motion.p {...fadeUp(0.12)} className="mt-4 text-base text-zinc-400 leading-relaxed max-w-xl">
        {t("cli.description")}
      </motion.p>

      <motion.div {...fadeUp(0.18)} className="mt-7">
        <p className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {t("cli.installLabel")}
        </p>
        <SectionCard
          header={
            <span className="font-mono text-sm text-violet-300 flex items-center gap-2">
              <span className="text-zinc-600 select-none">$</span>
              {installCmd}
            </span>
          }
          bodyClassName="p-0"
        >
          <div className="flex justify-end px-3 py-2 border-t border-white/[0.05]">
            <CopyButton
              textToCopy={installCmd}
              successMessage={t("common.copied")}
              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 hover:border-violet-500/30 hover:text-violet-400"
            >
              <span>{t("common.copy")}</span>
            </CopyButton>
          </div>
        </SectionCard>
        <p className="mt-2 text-xs text-zinc-600">
          {t("cli.orDownload")}{" "}
          <a
            href="https://github.com/Spoakk/cli/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-500 hover:text-violet-400 underline underline-offset-2"
          >
            {t("cli.githubReleases")}
          </a>
        </p>
      </motion.div>

      <motion.div {...fadeUp(0.24)} className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] shadow-2xl shadow-violet-500/5">
        <Image
          src="/cli/cli.png"
          alt="Spoak CLI interactive mode"
          width={1110}
          height={588}
          className="w-full"
          priority
        />
      </motion.div>

      <motion.div {...fadeUp(0.3)} className="mt-10 grid grid-cols-2 gap-3">
        {features.map(({ icon, key }) => (
          <Card key={key} className="p-4">
            <div className="mb-2 text-zinc-400">{icon}</div>
            <p className="text-sm font-semibold text-zinc-200">{t(`cli.features.${key}.title`)}</p>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{t(`cli.features.${key}.desc`)}</p>
          </Card>
        ))}
      </motion.div>

      <motion.div {...fadeUp(0.36)} className="mt-12">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <IconWifi className="h-5 w-5 text-violet-400" />
          {t("nav.mcping")}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="overflow-hidden rounded-xl border border-white/[0.07]">
            <Image src="/cli/ping.png" alt="spoak ping" width={391} height={141} className="w-full sm:w-auto" />
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">{t("cli.pingDesc")}</p>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.4)} className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <IconPlayerProfile className="h-5 w-5 text-violet-400" />
          {t("nav.playerprofile")}
        </h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <Image src="/cli/player.png" alt="spoak player" width={1009} height={121} className="w-full" />
        </div>
        <p className="mt-2 text-xs text-zinc-600">{t("cli.playerDesc")}</p>
      </motion.div>

      <motion.div {...fadeUp(0.44)} className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <IconServerJars className="h-5 w-5 text-violet-400" />
            {t("nav.serverjars")}
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.07]">
            <Image src="/cli/jars-versions.png" alt="spoak jars versions" width={649} height={367} className="w-full" />
          </div>
          <p className="mt-2 text-xs text-zinc-600">{t("cli.jarsDesc")}</p>
        </div>
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <IconTerminal className="h-5 w-5 text-violet-400" />
            {t("common.help") || "Help"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.07]">
            <Image src="/cli/help.png" alt="spoak help" width={497} height={257} className="w-full" />
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            {t("cli.helpDesc").replace("{cmd}", "help")}
          </p>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.5)} className="mt-12 flex flex-wrap gap-3">
        <Button
          variant="violet"
          href="https://github.com/Spoakk/cli/releases/latest"
        >
          <IconDownload className="h-4 w-4" />
          {t("cli.downloadBinary")}
        </Button>
        <Button variant="secondary" href="https://github.com/Spoakk/cli">
          <IconGithub className="h-4 w-4" />
          {t("cli.viewGithub")}
          <IconArrowRight className="h-3.5 w-3.5" />
        </Button>
      </motion.div>

    </main>
  );
}

