"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ToolGrid from "@/components/ui/ToolGrid";

export default function FeaturesSection() {
  const { t: rawT } = useTranslation();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const t = (key: string) => mounted ? rawT(key) : "";

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 45, damping: 15 }}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 45, damping: 15 }}
            className="mt-4 text-zinc-400 max-w-xl mx-auto"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>
        <ToolGrid animate="view" iconSize="sm" />
      </div>
    </section>
  );
}
