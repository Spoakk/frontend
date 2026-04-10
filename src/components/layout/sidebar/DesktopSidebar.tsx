"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  IconHome, IconInfo, IconSettings, IconSearch,
  IconChevron, IconBook, IconWrench, IconMarketplace, IconHeart,
} from "@/components/ui/Icons";
import { useApiStatus } from "@/components/providers/ApiStatusProvider";
import ToolLink from "./ToolLink";
import type { ToolItem, FavToggleFn } from "./types";

interface Props {
  toolItems: ToolItem[];
  favs: string[];
  onToggleFav: FavToggleFn;
  onOpenSettings: () => void;
}

export default function DesktopSidebar({ toolItems, favs, onToggleFav, onOpenSettings }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { status: apiStatus } = useApiStatus();
  const [toolsOpen, setToolsOpen] = useState(pathname.startsWith("/tools"));
  const [search, setSearch] = useState("");
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const tr = (key: string) => mounted ? t(key) : "";

  const isActive = (href: string) => pathname === href;

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return toolItems;
    return toolItems.filter((item) => item.key.includes(q) || item.href.includes(q));
  }, [search, toolItems]);

  const favTools = useMemo(() => toolItems.filter((item) => favs.includes(item.key)), [favs, toolItems]);
  const effectiveOpen = toolsOpen || search.length > 0;

  const navLink = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active ? "bg-white/8 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
        <Image src="/spoak.svg" alt="Spoak" width={28} height={28} className="shrink-0" />
        <span className="font-bold text-white text-lg tracking-tight">Spoak</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 min-h-0">
        <Link href="/" className={navLink(isActive("/"))}>
          <IconHome className="h-5 w-5" />
          {tr("nav.home")}
        </Link>

        <Link href="/marketplace" className={navLink(pathname.startsWith("/marketplace"))}>
          <IconMarketplace className="h-5 w-5" />
          {tr("nav.marketplace")}
        </Link>

        <AnimatePresence>
          {favTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                {tr("sidebar.favorites")}
              </p>
              <ul className="space-y-0.5">
                {favTools.map((item) => (
                  <ToolLink key={item.key} item={item} favs={favs} onToggleFav={onToggleFav} />
                ))}
              </ul>
              <div className="mx-3 mt-2 mb-1 h-px bg-white/6" />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <button
            onClick={() => setToolsOpen((v) => !v)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/tools") ? "bg-white/8 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <IconWrench className="h-5 w-5" />
            <span className="flex-1 text-left">{tr("nav.tools")}</span>
            <IconChevron open={effectiveOpen} className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/status"
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${
              isActive("/status") ? "text-emerald-400" : "text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              apiStatus === "ok" ? "bg-emerald-400" : apiStatus === "error" ? "bg-red-500" : "bg-zinc-600"
            }`} />
            {tr("nav.status")}
          </Link>

          <AnimatePresence initial={false}>
            {effectiveOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-1 ml-5 pl-3 border-l border-white/8"
              >
                <div className="relative mb-2">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <IconSearch className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr("sidebar.searchPlaceholder")}
                    className="w-full rounded-md border border-white/8 bg-white/[0.03] pl-7 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-emerald-500/40 focus:outline-none transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {filteredTools.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-zinc-600">{tr("sidebar.noToolsFound")}</p>
                ) : (
                  <ul className="space-y-0.5">
                    {filteredTools.map((item) => (
                      <ToolLink key={item.key} item={item} favs={favs} onToggleFav={onToggleFav} />
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="border-t border-white/8 px-3 py-3 space-y-0.5">
        <Link href="/docs" className={navLink(isActive("/docs"))}>
          <IconBook className="h-5 w-5" />
          {tr("nav.docs")}
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/about"
            className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/about") ? "bg-white/8 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <IconInfo className="h-5 w-5" />
            {tr("nav.about")}
          </Link>
          <Link href="/sponsors" title={tr("nav.sponsor")}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive("/sponsors") ? "bg-white/8 text-pink-400" : "text-zinc-400 hover:bg-white/5 hover:text-pink-400"
            }`}
          >
            <IconHeart className="h-4 w-4" />
            {tr("nav.sponsor")}
          </Link>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <IconSettings className="h-5 w-5" />
          {tr("nav.settings")}
        </button>
      </div>
    </div>
  );
}

