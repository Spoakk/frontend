"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TOOLS, type ToolDef } from "@/lib/tools";
import { Card } from "@/components/ui/Card";

interface ToolGridProps {
  tools?: ToolDef[];
  animate?: "view" | "mount";
  iconSize?: "sm" | "md";
}

export default function ToolGrid({ tools = TOOLS, animate = "view", iconSize = "sm" }: ToolGridProps) {
  const { t } = useTranslation();
  const iconClass = iconSize === "md" ? "h-12 w-12" : "h-10 w-10";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => {
        const motionProps = animate === "view"
          ? {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.2 as const },
              transition: { delay: i * 0.1, duration: 0.7, type: "spring" as const, stiffness: 45, damping: 15 },
            }
          : {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.05, duration: 0.5, type: "spring" as const, stiffness: 50 },
            };

        return (
          <motion.div key={tool.key} {...motionProps}>
            <Card href={tool.href} glow className="h-full p-6 hover:scale-[1.02]">
              <div className={`mb-4 inline-flex ${iconClass} items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors duration-300`}>
                {tool.icon}
              </div>
              <h3 className={`mb-2 font-semibold text-white ${iconSize === "md" ? "text-lg" : ""}`}>
                {t(`features.tools.${tool.key}.title`)}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {t(`features.tools.${tool.key}.description`)}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-1 group-hover:translate-y-0">
                {t("features.openTool")}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
