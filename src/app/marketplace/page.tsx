"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  IconSpinner, IconSearch,
  IconChevronLeft, IconChevronRight,
  IconChevronsLeft, IconChevronsRight,
  IconDownloadCloud, IconHeart,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import DownloadModal from "@/components/marketplace/DownloadModal";

const LIMIT = 40; // 4 × 10
const API = "https://api.modrinth.com/v2";

interface Plugin {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  icon_url: string | null;
  downloads: number;
  follows: number;
  categories: string[];
  gallery: string[];
  color: number | null;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function colorToHex(c: number | null): string {
  if (!c) return "#18181b";
  return `#${(c >>> 0).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, amount = 60): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amount);
  const g = Math.max(0, ((n >> 8) & 0xff) - amount);
  const b = Math.max(0, (n & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const SORT_OPTIONS = ["relevance", "downloads", "follows", "newest", "updated"] as const;
type SortIndex = typeof SORT_OPTIONS[number];

function PluginCard({ plugin, index, onDownload, tDownload }: { plugin: Plugin; index: number; onDownload: (p: Plugin) => void; tDownload: string }) {
  const bannerSrc = plugin.gallery?.[0] ?? null;
  const baseColor = colorToHex(plugin.color);
  const darkColor = darken(baseColor);

  return (
    <motion.a
      href={`https://modrinth.com/plugin/${plugin.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.012, duration: 0.25 }}
      className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
    >
      <div
        className="h-28 w-full relative overflow-hidden shrink-0"
        style={{
          background: bannerSrc
            ? undefined
            : `linear-gradient(135deg, ${baseColor}cc, ${darkColor})`,
        }}
      >
        {bannerSrc && (
          <Image src={bannerSrc} alt="" fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-500" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      <div className="px-4 -mt-5 mb-2 flex items-end gap-3 relative z-10">
        <div className="h-11 w-11 shrink-0 rounded-xl overflow-hidden bg-[#0c0c0f] border-2 border-[#0c0c0f] shadow-xl flex items-center justify-center">
          {plugin.icon_url ? (
            <Image src={plugin.icon_url} alt={plugin.title} width={44} height={44} className="object-cover" unoptimized />
          ) : (
            <span
              className="h-full w-full flex items-center justify-center text-base font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${baseColor}, ${darkColor})` }}
            >
              {plugin.title[0]}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 flex-1 flex flex-col">
        <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors leading-snug">
          {plugin.title}
        </p>
        <p className="text-[11px] text-zinc-600 truncate mb-2">{plugin.author}</p>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-1">
          {plugin.description}
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 pb-4 pt-1 text-[11px] text-zinc-600 border-t border-white/5 mt-1">
        <span className="flex items-center gap-1.5">
          <IconDownloadCloud className="h-3 w-3 text-zinc-500" />
          {fmt(plugin.downloads)}
        </span>
        <span className="flex items-center gap-1.5">
          <IconHeart className="h-3 w-3 text-zinc-500" />
          {fmt(plugin.follows)}
        </span>
        
        <div className="ml-auto flex items-center gap-2">
          {plugin.categories[0] && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-600 truncate max-w-16">
              {plugin.categories[0]}
            </span>
          )}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(plugin); }}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/8 transition-colors"
            title={tDownload}
          >
            <IconDownloadCloud className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.a>
  );
}

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [sort, setSort] = useState<SortIndex>("downloads");

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadPlugin, setDownloadPlugin] = useState<{slug: string, title: string} | null>(null);

  const openDownloadModal = (plugin: Plugin) => {
    setDownloadPlugin({ slug: plugin.slug, title: plugin.title });
    setDownloadModalOpen(true);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const fetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPlugins = useCallback(async (q: string, p: number, s: SortIndex) => {
    setLoading(true);
    setError(null);
    try {
      const facets = encodeURIComponent(JSON.stringify([["project_type:plugin"]]));
      const url = `${API}/search?facets=${facets}&limit=${LIMIT}&offset=${p * LIMIT}&index=${s}${q ? `&query=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url, { headers: { "User-Agent": "spoak/1.0 (https://spoak.cc)" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPlugins(data.hits);
      setTotal(data.total_hits);
    } catch (e) {
      setError((e as Error).message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => {
      fetchPlugins(query, page, sort);
    }, 300);
    return () => {
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    };
  }, [query, page, sort, fetchPlugins]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
    setQuery(inputVal.trim());
  };

  const goPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageWindow = (() => {
    const half = 2;
    let start = Math.max(0, page - half);
    const end = Math.min(totalPages - 1, start + 4);
    start = Math.max(0, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  const paginationControls = totalPages > 1 && !loading ? (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      <button onClick={() => goPage(0)} disabled={page === 0}
        className="rounded-lg border border-white/8 p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <IconChevronsLeft className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => goPage(page - 1)} disabled={page === 0}
        className="rounded-lg border border-white/8 p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <IconChevronLeft className="h-3.5 w-3.5" />
      </button>

      {pageWindow.map(p => (
        <button key={p} onClick={() => goPage(p)}
          className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
            p === page
              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
              : "border-white/8 text-zinc-400 hover:text-white"
          }`}>
          {p + 1}
        </button>
      ))}

      <button onClick={() => goPage(page + 1)} disabled={page >= totalPages - 1}
        className="rounded-lg border border-white/8 p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <IconChevronRight className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => goPage(totalPages - 1)} disabled={page >= totalPages - 1}
        className="rounded-lg border border-white/8 p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
        <IconChevronsRight className="h-3.5 w-3.5" />
      </button>

      <span className="text-xs text-zinc-600 ml-1">{page + 1} / {totalPages.toLocaleString()}</span>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("marketplace.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("marketplace.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("marketplace.description")}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <form onSubmit={handleSearch} className="flex flex-1 min-w-56 gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                <IconSearch className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={t("marketplace.searchPlaceholder")}
                className="w-full rounded-xl border border-white/8 bg-white/[0.03] pl-9 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500/40 focus:outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0f]"
              />
            </div>
            <Button type="submit">
              {t("marketplace.searchBtn")}
            </Button>
          </form>

          <Select
            value={sort}
            onChange={(val) => { setSort(val as SortIndex); setPage(0); }}
            options={SORT_OPTIONS.map(s => ({ value: s, label: t(`marketplace.sort.${s}`) }))}
            className="w-48"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {!loading && total > 0 && (
            <p className="text-xs text-zinc-600">
              {t("marketplace.showing", { from: page * LIMIT + 1, to: Math.min((page + 1) * LIMIT, total), total: total.toLocaleString() })}
            </p>
          )}
          {paginationControls && <div className="hidden sm:block">{paginationControls}</div>}
        </div>
        {paginationControls && <div className="sm:hidden mb-6">{paginationControls}</div>}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <IconSpinner className="h-8 w-8 text-emerald-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {plugins.map((p, i) => <PluginCard key={p.project_id} plugin={p} index={i} onDownload={openDownloadModal} tDownload={t("marketplace.download", "Download")} />)}
          </div>
        )}

        {paginationControls && (
          <div className="mt-8">
            {paginationControls}
          </div>
        )}

      </motion.div>

      <DownloadModal 
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        pluginSlug={downloadPlugin?.slug ?? null}
        pluginName={downloadPlugin?.title ?? ""}
      />
    </div>
  );
}
