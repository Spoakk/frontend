"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconDiscord } from "./Icons";

export function DiscordButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 hidden md:block"
    >
      <Link
        href="/discord"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5865F2] shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#5865F2]/30 active:scale-95"
        aria-label="Join our Discord server"
      >
        <IconDiscord className="h-7 w-7 text-white" />
      </Link>
    </motion.div>
  );
}
