"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconSettings, IconSparkle } from "@/components/ui/Icons";
import SettingsModal from "@/components/layout/SettingsModal";

export default function NewsSection() {
  const { t } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.05] to-green-500/[0.03]">
              <div className="grid gap-10 p-10 md:grid-cols-2 md:gap-14 md:p-14">
                
                <div className="flex flex-col justify-center">
                  <div className="mb-5 inline-flex items-center gap-2.5 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 shadow-lg shadow-emerald-500/5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                    {mounted ? "New Feature" : ""}
                  </div>

                  <h2 className="text-4xl font-bold text-white sm:text-5xl mb-5 leading-tight">
                    Quick Access{" "}
                    <span className="text-emerald-400">
                      Mode
                    </span>
                  </h2>

                  <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                    {mounted ? t("settings.quickAccessDesc") : "Open tools in modal instead of navigating to page"}. Enable it in Settings for faster workflow.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" onClick={() => setSettingsOpen(true)}>
                      <IconSettings className="h-4 w-4" />
                      {mounted ? t("nav.settings") : "Settings"}
                    </Button>
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 -z-10 blur-3xl opacity-40">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl animate-pulse" style={{ animationDuration: "3s" }} />
                    </div>
                    
                    <div className="relative rounded-2xl border border-emerald-500/30 bg-[#0a0a0f]/90 backdrop-blur-sm overflow-hidden shadow-2xl p-10">
                      <div className="space-y-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
                            <IconSparkle className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-white">Quick Access</p>
                            <p className="text-sm text-zinc-500">Modal-based tools</p>
                          </div>
                        </div>
                        <div className="space-y-3 text-sm text-zinc-400">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                            <span>Faster workflow</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                            <span>No page navigation</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                            <span>Toggle in Settings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          </motion.div>

        </div>
      </section>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
