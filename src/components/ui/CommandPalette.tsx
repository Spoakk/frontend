"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { IconSearch, IconClose, IconClock, IconChevronRight } from "@/components/ui/Icons";
import { TOOLS } from "@/lib/tools";
import { fuzzySearch, type SearchItem } from "@/lib/fuzzySearch";
import { useQuickAccessContext } from "@/components/providers/QuickAccessProvider";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  recentSearches: string[];
  onAddRecent: (query: string) => void;
  onClearRecent: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  recentSearches,
  onAddRecent,
  onClearRecent,
}: CommandPaletteProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { quickAccess, setOpenTool } = useQuickAccessContext();
  const [query, setQueryState] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setSelectedIndex(0);
  }, []);

  const searchItems: SearchItem[] = useMemo(() => {
    const tools = TOOLS.map((tool) => ({
      id: tool.key,
      title: t(`nav.${tool.key}`),
      description: t(`quickLinks.${tool.key}`),
      href: tool.href,
      category: "tool" as const,
      keywords: [tool.key],
      icon: tool.icon,
    }));
    
    const pages: SearchItem[] = [
      { id: "home", title: t("nav.home"), href: "/", category: "page", keywords: ["anasayfa", "main"] },
      { id: "cli", title: t("nav.cli"), href: "/cli", category: "page", keywords: ["command", "terminal"] },
      { id: "marketplace", title: t("nav.marketplace"), href: "/marketplace", category: "page", keywords: ["market", "pazar"] },
      { id: "docs", title: t("nav.docs"), href: "/docs", category: "page", keywords: ["döküman", "guide", "documentation"] },
      { id: "about", title: t("nav.about"), href: "/about", category: "page", keywords: ["hakkında", "info"] },
      { id: "sponsors", title: t("nav.sponsor"), href: "/sponsors", category: "page", keywords: ["sponsor", "destek", "support"] },
      { id: "status", title: t("nav.status"), href: "/status", category: "page", keywords: ["durum", "health", "api"] },
    ];
    
    return [...tools, ...pages];
  }, [t]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuzzySearch(searchItems, query).slice(0, 8);
  }, [query, searchItems]);

  useLayoutEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, setQuery]);

  const handleSelect = useCallback((item: SearchItem) => {
    onAddRecent(query);
    onClose();

    if (item.category === "tool" && quickAccess) {
      const toolKey = item.href.replace("/tools/", "");
      setOpenTool(toolKey);
    } else {
      router.push(item.href);
    }
  }, [query, onAddRecent, onClose, quickAccess, setOpenTool, router]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleSelect]);

  const handleRecentClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111114] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <IconSearch className="h-5 w-5 text-zinc-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder") || "Search tools, pages, docs..."}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base"
            />
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <IconClose className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {t("search.recent") || "Recent"}
                  </p>
                  <button
                    onClick={onClearRecent}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {t("search.clear") || "Clear"}
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => handleRecentClick(search)}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/5 transition-colors group"
                    >
                      <IconClock className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
                      <span className="text-sm text-zinc-400 group-hover:text-white">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-zinc-500">{t("search.noResults") || "No results found"}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-3 space-y-1">
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      i === selectedIndex
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "hover:bg-white/5 text-zinc-400"
                    }`}
                  >
                    {item.icon && (
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
                        i === selectedIndex
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 bg-white/5"
                      }`}>
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${i === selectedIndex ? "text-white" : "text-zinc-200"}`}>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        i === selectedIndex
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/5 text-zinc-600"
                      }`}>
                        {t(`search.category.${item.category}`)}
                      </span>
                      <IconChevronRight className={`h-3.5 w-3.5 ${
                        i === selectedIndex ? "text-emerald-400" : "text-zinc-600"
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd>
                {t("search.navigate") || "Navigate"}
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd>
                {t("search.select") || "Select"}
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">esc</kbd>
              {t("search.close") || "Close"}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
