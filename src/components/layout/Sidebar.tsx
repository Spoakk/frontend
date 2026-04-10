"use client";

import { useState, useMemo } from "react";
import { TOOLS } from "@/lib/tools";
import SettingsModal from "@/components/layout/SettingsModal";
import DesktopSidebar from "@/components/layout/sidebar/DesktopSidebar";
import MobileDrawer from "@/components/layout/sidebar/MobileDrawer";

const TOOL_ITEMS = TOOLS.map(t => ({
  ...t,
  icon: <span className="h-4 w-4 flex items-center justify-center">{t.icon}</span>,
}));

const FAVS_KEY = "spoak_favs";

function loadFavs(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAVS_KEY) ?? "[]"); } catch { return []; }
}
function saveFavs(favs: string[]) {
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
}
function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let id: NodeJS.Timeout;
  return ((...args: Parameters<T>) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); }) as T;
}

export default function Sidebar() {
  const [favs, setFavs] = useState<string[]>(() => loadFavs());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const debouncedSave = useMemo(() => debounce(saveFavs, 300), []);

  const toggleFav = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      debouncedSave(next);
      return next;
    });
  };

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0 border-r border-white/8 bg-[#0c0c0f]">
        <DesktopSidebar
          toolItems={TOOL_ITEMS}
          favs={favs}
          onToggleFav={toggleFav}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </aside>

      <div className="md:hidden">
        <MobileDrawer
          toolItems={TOOL_ITEMS}
          favs={favs}
          onToggleFav={toggleFav}
          onOpenSettings={() => setSettingsOpen(true)}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
        />
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
