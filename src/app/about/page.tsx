"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { IconCode, IconOrg, IconUsers, IconExternalLink } from "@/components/ui/Icons";
import { Card, CardBody } from "@/components/ui/Card";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: "easeOut" },
});

export default function AboutPage() {
  const { t } = useTranslation();

  const cards = [
    { icon: <IconCode />, title: t("about.openSource"), desc: t("about.openSourceDesc"), link: { label: t("about.viewGithub"), href: "https://github.com/spoakk" } },
    { icon: <IconOrg />,  title: t("about.fraio"),      desc: t("about.fraioDesc"),      link: { label: t("about.visitFraio"), href: "https://fraio.cc" } },
    { icon: <IconUsers />,title: t("about.community"),  desc: t("about.communityDesc"),  link: { label: t("about.viewGithub"), href: "https://github.com/spoakk" } },
  ];

  return (
    <div className="relative min-h-screen bg-[#0c0c0f] overflow-hidden">

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-14">

        <motion.div {...fadeUp(0)} className="mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {t("about.badge")}
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
            {t("about.title")}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl leading-relaxed">
            {t("about.description")}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mb-8">
          <Card className="backdrop-blur-sm">
            <CardBody className="flex items-center gap-5">
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Image src="/spoak.svg" alt="Spoak" width={28} height={28} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Spoak</p>
                  <p className="text-xs text-zinc-500">by Fraio</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/8 shrink-0" />
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t("about.tagline")}{" "}
                <a href="https://fraio.cc" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Fraio
                </a>{" "}
                {t("about.taglineSuffix")}
              </p>
            </CardBody>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          {cards.map((card, i) => (
            <motion.div key={card.title} {...fadeUp(0.15 + i * 0.08)}>
              <Card className="backdrop-blur-sm h-full">
                <CardBody className="flex flex-col h-full">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed flex-1">{card.desc}</p>
                  <a
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    {card.link.label}
                    <IconExternalLink />
                  </a>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)}>
          <Card className="backdrop-blur-sm">
            <CardBody>
              <p className="text-xs font-medium text-zinc-400 mb-4">{t("about.techStack")}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Next.js 16",      color: "border-zinc-700 bg-zinc-800/10 text-zinc-300" },
                  { name: "TypeScript",      color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
                  { name: "Tailwind CSS v4", color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400" },
                  { name: "Framer Motion",   color: "border-purple-500/20 bg-purple-500/5 text-purple-400" },
                  { name: "i18next",         color: "border-teal-500/20 bg-teal-500/5 text-teal-400" },
                  { name: "Rust",            color: "border-orange-600/20 bg-orange-600/5 text-orange-400" },
                  { name: "Axum 0.7",        color: "border-zinc-500/20 bg-zinc-500/5 text-zinc-400" },
                  { name: "Tokio 1",         color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`rounded-md border px-3 py-1 text-xs font-medium ${tech.color}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
