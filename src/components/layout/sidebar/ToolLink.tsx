"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IconStar } from "@/components/ui/Icons";
import { useQuickAccessContext } from "@/components/providers/QuickAccessProvider";
import type { ToolItem, FavToggleFn } from "./types";

interface Props {
  item: ToolItem;
  favs: string[];
  onToggleFav: FavToggleFn;
  onClick?: () => void;
}

export default function ToolLink({ item, favs, onToggleFav, onClick }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { quickAccess, multiTool, setOpenTool, addToolWindow } = useQuickAccessContext();
  const active = pathname === item.href;
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const tr = (key: string) => mounted ? t(key) : "";

  const handleClick = (e: React.MouseEvent) => {
    if (quickAccess) {
      e.preventDefault();
      const toolKey = item.href.replace("/tools/", "");
      
      if (multiTool) {
        addToolWindow(toolKey);
      } else {
        setOpenTool(toolKey);
      }
      
      onClick?.();
    }
  };

  return (
    <li>
      <Link
        href={item.href}
        onClick={handleClick}
        className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
          active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        <span className={`shrink-0 transition-colors ${active ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"}`}>
          {item.icon}
        </span>
        <span className="truncate flex-1">{t(`nav.${item.key}`)}</span>
        <button
          onClick={(e) => onToggleFav(item.key, e)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={favs.includes(item.key) ? tr("sidebar.removeFavorite") : tr("sidebar.addFavorite")}
        >
          <IconStar filled={favs.includes(item.key)} className="h-4 w-4" />
        </button>
      </Link>
    </li>
  );
}

