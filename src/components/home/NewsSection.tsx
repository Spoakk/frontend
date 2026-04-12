"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconTerminal, IconDownload } from "@/components/ui/Icons";
import Image from "next/image";

export default function NewsSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/[0.03] to-purple-500/[0.02]">
            <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12">
              
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                  {mounted ? t("cli.badge") : ""}
                </div>

                <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                  {mounted ? t("cli.title") : ""}{" "}
                  <span className="text-violet-400">
                    {mounted ? t("cli.titleHighlight") : ""}
                  </span>
                </h2>

                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {mounted ? t("cli.description") : ""}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button variant="violet" href="/cli">
                    <IconTerminal className="h-4 w-4" />
                    {mounted ? t("cli.viewDetails") : "View Details"}
                  </Button>
                  <Button variant="secondary" href="https://github.com/Spoakk/cli/releases">
                    <IconDownload className="h-4 w-4" />
                    {mounted ? t("cli.downloadBinary") : "Download"}
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl" />
                  </div>
                  
                  <div className="relative rounded-xl border border-violet-500/30 bg-[#0a0a0f]/90 backdrop-blur-sm overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <div className="ml-2 text-xs text-zinc-500 font-mono">spoak-cli</div>
                    </div>
                    
                    <div className="p-4">
                      <Image
                        src="/cli/cli.png"
                        alt="Spoak CLI"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
