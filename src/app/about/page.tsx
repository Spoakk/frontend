"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { IconCode, IconOrg, IconUsers, IconExternalLink, IconSparkle, IconGithub, IconDiscord } from "@/components/ui/Icons";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

export default function AboutPage() {
  const { t } = useTranslation();

  const cards = [
    { 
      icon: <IconCode className="h-5 w-5" />, 
      title: t("about.openSource"), 
      desc: t("about.openSourceDesc"), 
      link: { label: t("about.viewGithub"), href: "https://github.com/spoakk" } 
    },
    { 
      icon: <IconSparkle className="h-5 w-5" />,  
      title: t("about.heranw"),      
      desc: t("about.heranwDesc"),      
      link: { label: t("about.visitHeraNW"), href: "https://heranw.com.tr" } 
    },
    { 
      icon: <IconUsers className="h-5 w-5" />,
      title: t("about.community"),  
      desc: t("about.communityDesc"),  
      link: { label: t("about.viewGithub"), href: "https://github.com/spoakk" } 
    },
  ];

  const techStack = [
    { name: "Next.js 16",      color: "border-zinc-700 bg-zinc-800/10 text-zinc-300" },
    { name: "TypeScript",      color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
    { name: "Tailwind CSS v4", color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400" },
    { name: "Framer Motion",   color: "border-purple-500/20 bg-purple-500/5 text-purple-400" },
    { name: "i18next",         color: "border-teal-500/20 bg-teal-500/5 text-teal-400" },
    { name: "Rust",            color: "border-orange-600/20 bg-orange-600/5 text-orange-400" },
    { name: "Axum 0.7",        color: "border-zinc-500/20 bg-zinc-500/5 text-zinc-400" },
    { name: "Tokio 1",         color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
  ];

  return (
    <div className="relative min-h-screen bg-[#08080a] overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-emerald-400/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 lg:py-32">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div {...fadeUp(0)} className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              {t("about.badge")}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              {t("about.title")}
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-8">
              {t("about.description")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                href="https://github.com/spoakk" 
                variant="secondary"
              >
                <IconGithub className="h-5 w-5" />
                GitHub
              </Button>
              <Button 
                href="https://heranw.com.tr" 
                variant="primary"
              >
                <IconSparkle className="h-5 w-5" />
                {t("about.visitHeraNW")}
              </Button>
            </div>
          </motion.div>

          <motion.div 
            {...fadeUp(0.2)} 
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-square max-w-[400px] mx-auto lg:ml-auto">
              {/* Floating Element */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="relative h-full w-full rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-8 flex flex-col items-center justify-center overflow-hidden group">
                <div className="relative z-10">
                  <Image 
                    src="/spoak.svg" 
                    alt="Spoak Logo" 
                    width={160} 
                    height={160} 
                    className="drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  />
                </div>
                
                {/* Decorative particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   {[...Array(6)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
                       animate={{
                         y: [-20, 420],
                         x: [Math.random() * 400, Math.random() * 400],
                         opacity: [0, 1, 0]
                       }}
                       transition={{
                         duration: 3 + Math.random() * 4,
                         repeat: Infinity,
                         delay: Math.random() * 5
                       }}
                     />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {cards.map((card, i) => (
            <motion.div 
              key={card.title} 
              {...fadeUp(0.1 + i * 0.1)}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full bg-zinc-900/30 backdrop-blur-sm border-white/5 hover:border-emerald-500/30 group transition-all">
                <CardBody className="flex flex-col p-8">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{card.title}</h3>
                  <p className="text-zinc-500 leading-relaxed mb-8 flex-1">
                    {card.desc}
                  </p>
                  <a
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors"
                  >
                    {card.link.label}
                    <IconExternalLink className="h-4 w-4" />
                  </a>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Brand / Organization Info */}
        <motion.div {...fadeUp(0.4)} className="mb-24">
          <div className="relative rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-12 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <IconSparkle className="w-64 h-64 text-emerald-500" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-6">
                   <span className="text-emerald-500">HeraNW</span> {t("about.taglineSuffix")}
                </h2>
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                   {t("about.tagline")} {t("about.heranwDesc")}
                </p>
                <div className="flex flex-wrap gap-6">
                   <div className="flex flex-col">
                     <span className="text-zinc-600 text-xs uppercase tracking-widest font-bold mb-1">Version</span>
                     <span className="text-white font-mono">1.21.4 (Latest)</span>
                   </div>
                   <div className="h-10 w-px bg-white/10 hidden sm:block" />
                   <div className="flex flex-col">
                     <span className="text-zinc-600 text-xs uppercase tracking-widest font-bold mb-1">Game Mode</span>
                     <span className="text-white font-mono">Advanced Towny</span>
                   </div>
                   <div className="h-10 w-px bg-white/10 hidden sm:block" />
                   <div className="flex flex-col">
                     <span className="text-zinc-600 text-xs uppercase tracking-widest font-bold mb-1">Server IP</span>
                     <span className="text-emerald-400 font-mono font-bold">play.heranw.com.tr</span>
                   </div>
                </div>
              </div>
              
              <div className="shrink-0">
                <a 
                  href="https://heranw.com.tr" 
                  target="_blank"
                  className="flex flex-col items-center group"
                >
                  <div className="w-32 h-32 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform duration-500">
                    <IconSparkle className="h-16 w-16 text-black" />
                  </div>
                  <span className="mt-4 text-emerald-400 font-bold group-hover:text-emerald-300 transition-colors">heranw.com.tr</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div {...fadeUp(0.5)}>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">{t("about.techStack")}</h2>
            <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, idx) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className={`rounded-xl border px-5 py-2 text-sm font-semibold backdrop-blur-md ${tech.color} hover:scale-105 transition-transform cursor-default`}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Footer-like note */}
      <div className="relative z-10 border-t border-white/5 bg-zinc-950/50 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <Image src="/spoak.svg" alt="Spoak" width={32} height={32} className="opacity-50 grayscale hover:grayscale-0 transition-all" />
             <p className="text-sm text-zinc-600 font-medium">
               &copy; {new Date().getFullYear()} HeraNW Network. All rights reserved.
             </p>
          </div>
          <div className="flex items-center gap-6">
             <a href="https://discord.gg/heranw" target="_blank" className="text-zinc-600 hover:text-white transition-colors">
               <IconDiscord className="h-5 w-5" />
             </a>
             <a href="https://github.com/spoakk" target="_blank" className="text-zinc-600 hover:text-white transition-colors">
               <IconGithub className="h-5 w-5" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
