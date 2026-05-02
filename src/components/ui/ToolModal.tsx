"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconClose } from "./Icons";
import { useQuickAccessContext } from "../providers/QuickAccessProvider";

export function ToolModal() {
  const { openTool, setOpenTool } = useQuickAccessContext();
  const [ToolComponent, setToolComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!openTool) {
      setToolComponent(null);
      return;
    }

    import(`@/app/tools/${openTool}/page`)
      .then((mod) => setToolComponent(() => mod.default))
      .catch(() => setToolComponent(null));
  }, [openTool]);

  const handleClose = useCallback(() => setOpenTool(null), [setOpenTool]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = openTool ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openTool]);

  return (
    <AnimatePresence>
      {openTool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full h-full rounded-xl border border-white/10 bg-[#141417] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-all duration-300 hover:scale-110 hover:bg-red-400/10 hover:text-red-400"
                aria-label="Close"
              >
                <IconClose className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0c0c0f]">
              {ToolComponent ? (
                <div className="min-h-full">
                  <ToolComponent />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-zinc-500">Loading...</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
