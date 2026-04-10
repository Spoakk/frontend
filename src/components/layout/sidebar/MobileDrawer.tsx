"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  IconHome, IconInfo, IconSettings, IconStar,
  IconBook, IconWrench, IconMarketplace, IconClose, IconHeart,
} from "@/components/ui/Icons";
import { useApiStatus } from "@/components/providers/ApiStatusProvider";
import type { ToolItem, FavToggleFn } from "./types";

interface Props {
  toolItems: ToolItem[];
  favs: string[];
  onToggleFav: FavToggleFn;
  onOpenSettings: () => void;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function MobileDrawer({ toolItems, favs, onToggleFav, onOpenSettings, open, onClose, onOpen }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { status: apiStatus } = useApiStatus();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const tr = (key: string) => mounted ? t(key) : "";

  const isActive = (href: string) => pathname === href;

  const favTools = useMemo(() => toolItems.filter((item) => favs.includes(item.key)), [favs, toolItems]);

  const pillItems = [
    { href: "/",            icon: <IconHome className="h-5 w-5" />,        label: tr("nav.home"),        active: isActive("/") },
    { href: "/marketplace", icon: <IconMarketplace className="h-5 w-5" />, label: tr("nav.marketplace"), active: pathname.startsWith("/marketplace") },
    { href: "/docs",        icon: <IconBook className="h-5 w-5" />,        label: tr("nav.docs"),        active: isActive("/docs") },
    { href: "/about",       icon: <IconInfo className="h-5 w-5" />,        label: tr("nav.about"),       active: isActive("/about") },
    { href: "/sponsors",    icon: <IconHeart className="h-5 w-5" />,       label: tr("nav.sponsor"),     active: isActive("/sponsors") },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              key="drawer"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/10 bg-[#111114] flex flex-col"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 60px)" }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/15" />
              </div>

              <div className="flex items-center justify-end px-5 py-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:bg-white/15 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <IconClose className="h-3.5 w-3.5" />
                </button>
              </div>

              {favTools.length > 0 && (
                <div className="px-4 pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2 px-1">
                    {tr("sidebar.favorites")}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {favTools.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
                          isActive(item.href)
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate text-xs font-medium">{t(`nav.${item.key}`)}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 h-px bg-white/6" />
                </div>
              )}

              <div className="flex items-center justify-between px-5 pt-1 pb-3">
                <Link
                  href="/status"
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    apiStatus === "ok" ? "bg-emerald-400" : apiStatus === "error" ? "bg-red-500" : "bg-zinc-600"
                  }`} />
                  {tr("nav.status")}
                </Link>
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenSettings(); }}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <IconSettings className="h-3.5 w-3.5" />
                  {tr("nav.settings")}
                </button>
              </div>

              <div className="px-4 pb-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                <div className="grid grid-cols-2 gap-1.5">
                  {toolItems.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
                        isActive(item.href)
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate text-xs font-medium flex-1">{t(`nav.${item.key}`)}</span>
                      <button
                        type="button"
                        onClick={(e) => onToggleFav(item.key, e)}
                        className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={favs.includes(item.key) ? tr("sidebar.removeFavorite") : tr("sidebar.addFavorite")}
                      >
                        <IconStar filled={favs.includes(item.key)} className="h-3 w-3" />
                      </button>
                    </Link>
                  ))}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.nav
        initial={false}
        animate={{ y: open ? 20 : 0, scale: open ? 0.96 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#111114]/90 px-2 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {pillItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                item.active
                  ? item.href === "/sponsors" ? "text-pink-400" : "text-emerald-400"
                  : "text-zinc-500 hover:bg-white/8 hover:text-white"
              }`}
              aria-label={item.label}
            >
              {item.active && (
                <motion.span
                  layoutId="pill-active"
                  className={`absolute inset-0 rounded-full ${item.href === "/sponsors" ? "bg-pink-500/15" : "bg-emerald-500/15"}`}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
            </Link>
          ))}

          <div className="mx-1 h-5 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => open ? onClose() : onOpen()}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
              open || pathname.startsWith("/tools")
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-zinc-500 hover:bg-white/8 hover:text-white"
            }`}
            aria-label={tr("nav.tools")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconClose className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="tools"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconWrench className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>
    </>
  );
}

