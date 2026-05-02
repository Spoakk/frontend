"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  IconHome, IconInfo, IconSettings, IconSearch,
  IconChevron, IconBook, IconWrench, IconMarketplace, IconHeart, IconTerminal,
} from "@/components/ui/Icons";
import { useApiStatus } from "@/components/providers/ApiStatusProvider";
import { fuzzySearch, type SearchItem } from "@/lib/fuzzySearch";
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
  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const tr = (key: string) => mounted ? t(key) : "";

  const isActive = (href: string) => pathname === href;

  const favTools = useMemo(() => toolItems.filter((item) => favs.includes(item.key)), [favs, toolItems]);

  const searchItems = useMemo<SearchItem[]>(() => 
    toolItems.map((tool) => ({
      id: tool.key,
      title: t(`nav.${tool.key}`),
      description: t(`quickLinks.${tool.key}`),
      href: tool.href,
      category: "tool" as const,
      icon: tool.icon,
    })),
    [toolItems, t]
  );

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return toolItems;
    const results = fuzzySearch(searchItems, searchQuery);
    return results.map((result) => toolItems.find((tool) => tool.key === result.id)!).filter(Boolean);
  }, [searchQuery, searchItems, toolItems]);

  const navLink = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      active ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="mx-3 mt-3 mb-2 flex items-center gap-3 px-3 py-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
        <Image src="/spoak.svg" alt="Spoak" width={28} height={28} className="shrink-0" />
        <span className="font-bold text-white text-lg tracking-tight">Spoak</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
        <Link href="/" className={navLink(isActive("/"))}>
          <IconHome className="h-5 w-5" />
          {tr("nav.home")}
        </Link>

        <Link href="/cli" className={navLink(isActive("/cli"))}>
          <IconTerminal className="h-5 w-5" />
          {tr("nav.cli")}
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
              <p className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {tr("sidebar.favorites")}
              </p>
              <ul className="space-y-1">
                {favTools.map((item) => (
                  <ToolLink key={item.key} item={item} favs={favs} onToggleFav={onToggleFav} />
                ))}
              </ul>
              <div className="mx-3 mt-3 mb-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <button
            onClick={() => setToolsOpen((v) => !v)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              pathname.startsWith("/tools") ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <IconWrench className="h-5 w-5" />
            <span className="flex-1 text-left">{tr("nav.tools")}</span>
            <IconChevron open={toolsOpen} className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/status"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
              isActive("/status") ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-600 hover:text-zinc-400 hover:bg-white/5"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              apiStatus === "ok" ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : apiStatus === "error" ? "bg-red-500 shadow-sm shadow-red-500/50" : "bg-zinc-600"
            }`} />
            {tr("nav.status")}
          </Link>

          <AnimatePresence initial={false}>
            {toolsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-1 ml-5 pl-3 border-l border-white/8"
              >
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={tr("sidebar.searchPlaceholder")}
                    className="w-full flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 pl-8 text-xs text-zinc-300 placeholder:text-zinc-500 hover:border-emerald-500/40 hover:bg-white/8 focus:border-emerald-500/40 focus:bg-white/8 focus:outline-none transition-all"
                  />
                  <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                </div>
                {filteredTools.length === 0 && searchQuery.trim() ? (
                  <p className="text-xs text-zinc-600 px-3 py-2">{tr("sidebar.noToolsFound")}</p>
                ) : (
                  <ul className="space-y-1">
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

      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <Link href="/docs" className={navLink(isActive("/docs"))}>
          <IconBook className="h-5 w-5" />
          {tr("nav.docs")}
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/about"
            className={`flex-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive("/about") ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <IconInfo className="h-5 w-5" />
            {tr("nav.about")}
          </Link>
          <Link href="/sponsors" title={tr("nav.sponsor")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
              isActive("/sponsors") ? "bg-pink-500/15 text-pink-400 shadow-sm shadow-pink-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-pink-400"
            }`}
          >
            <IconHeart className="h-4 w-4" />
            {tr("nav.sponsor")}
          </Link>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <IconSettings className="h-5 w-5" />
          {tr("nav.settings")}
        </button>
      </div>
    </div>
  );
}

