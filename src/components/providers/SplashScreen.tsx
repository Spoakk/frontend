"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

async function waitUntilReady(): Promise<void> {
  const domReady = new Promise<void>((r) => {
    if (document.readyState === "complete") { r(); return; }
    window.addEventListener("load", () => r(), { once: true });
  });

  const fontsReady = document.fonts
    ? document.fonts.ready.then(() => undefined)
    : Promise.resolve();

  await Promise.all([domReady, fontsReady]);
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    waitUntilReady().then(() => setVisible(false));
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c0c0f]"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <Image src="/spoak.svg" alt="Spoak" width={48} height={48} priority />
            <span className="text-lg font-bold tracking-tight text-white">Spoak</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
