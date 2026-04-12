"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { config } from "@/lib/config";
import { IconSpinner } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const TILE_PX = 128;
const TILE_BLK = TILE_PX * 4;
const FETCH_DEBOUNCE_MS = 150;
const TILE_CACHE_MAX = 200;

type Structure = { kind: string; label: string; color: string; x: number; z: number };
interface VP { cx: number; cz: number; zoom: number }
type TileState = { status: "loading" | "ready" | "error"; bitmap?: ImageBitmap; lastAccessed?: number };

const BC: Record<number, [number, number, number]> = {
  0:[0,0,112],1:[141,179,96],2:[250,148,24],3:[96,96,96],4:[5,102,33],
  5:[11,106,95],6:[7,249,178],7:[0,0,255],8:[87,37,38],9:[128,128,255],
  10:[112,112,214],11:[160,160,255],12:[255,255,255],13:[160,160,160],
  14:[255,0,255],15:[160,0,255],16:[250,222,85],17:[210,95,18],
  18:[34,85,28],19:[22,57,51],20:[114,120,154],21:[80,123,10],
  22:[44,66,5],23:[96,147,15],24:[0,0,48],25:[162,162,132],
  26:[250,240,192],27:[48,116,68],28:[31,95,50],29:[64,81,26],
  30:[49,85,74],31:[36,63,54],32:[89,102,81],33:[69,79,62],
  34:[91,115,82],35:[189,178,95],36:[167,157,100],37:[217,69,21],
  38:[176,151,101],39:[202,140,101],40:[75,75,171],41:[201,201,89],
  42:[181,181,54],43:[112,112,204],44:[0,0,172],45:[0,0,144],
  46:[32,32,112],47:[0,0,80],48:[0,0,64],49:[32,32,56],50:[64,64,144],
  127:[0,0,0],129:[181,219,136],130:[255,188,64],131:[136,136,136],
  132:[45,142,73],133:[51,146,135],134:[47,255,218],140:[180,220,220],
  149:[120,163,50],151:[136,187,55],155:[88,156,108],156:[71,135,90],
  157:[104,121,66],158:[89,125,114],160:[129,142,121],161:[109,119,102],
  162:[131,155,122],163:[229,218,135],164:[207,197,140],165:[255,109,61],
  166:[216,191,141],167:[242,180,141],168:[132,149,0],169:[92,108,4],
  170:[77,58,46],171:[152,26,17],172:[73,144,123],173:[100,95,99],
  174:[78,48,18],175:[40,60,0],177:[96,164,69],178:[71,114,108],
  179:[196,196,196],180:[220,220,200],181:[176,179,206],182:[123,143,116],
  183:[3,31,41],184:[44,204,142],185:[255,145,200],186:[105,109,149],
};

function biomesToImageData(ids: Int16Array, size: number): ImageData {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const c = BC[ids[i]] ?? [30, 30, 30];
    data[i*4]=c[0]; data[i*4+1]=c[1]; data[i*4+2]=c[2]; data[i*4+3]=255;
  }
  return new ImageData(data, size, size);
}

export default function SeedMapPage() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [seed, setSeed] = useState("");
  const [version, setVersion] = useState("");
  const [versions, setVersions] = useState<string[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [showStructures, setShowStructures] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; z: number } | null>(null);
  const [isActive, setIsActive] = useState(false);

  const vp         = useRef<VP>({ cx: 0, cz: 0, zoom: 2 });
  const tileCache  = useRef(new Map<string, TileState>());
  const activeRef  = useRef(false);
  const seedRef    = useRef("");
  const verRef     = useRef("");
  const structs    = useRef<Structure[]>([]);
  const showStRef  = useRef(true);
  const raf        = useRef(0);
  const fetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag       = useRef(false);
  const lastPt     = useRef({ x: 0, y: 0 });

  useEffect(() => { seedRef.current = seed; }, [seed]);
  useEffect(() => { verRef.current = version; }, [version]);
  useEffect(() => { structs.current = structures; }, [structures]);
  useEffect(() => { showStRef.current = showStructures; }, [showStructures]);

  useEffect(() => {
    setLoadingVersions(true);
    api.versions().then(data => {
      setVersions(data.versions);
      if (data.versions.length > 0) {
        setVersion(data.versions[0]);
        verRef.current = data.versions[0];
      }
    }).catch(() => {}).finally(() => setLoadingVersions(false));
  }, []);

  const b2c = (bx: number, bz: number, W: number, H: number, v: VP) => ({
    px: (bx - v.cx) * v.zoom / 4 + W / 2,
    pz: (bz - v.cz) * v.zoom / 4 + H / 2,
  });

  const fetchTile = useCallback((key: string, bx: number, bz: number, s: string, ver: string) => {
    const url = `${config.apiUrl}/seedmap/tile?seed=${encodeURIComponent(s)}&x=${bx}&z=${bz}&size=${TILE_PX}&version=${encodeURIComponent(ver)}`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.arrayBuffer(); })
      .then(buf => createImageBitmap(biomesToImageData(new Int16Array(buf), TILE_PX)))
      .then(bitmap => {
        if (tileCache.current.size >= TILE_CACHE_MAX) {
          let oldestKey: string | null = null, oldestTime = Infinity;
          for (const [k, t] of tileCache.current) {
            const t2 = t.lastAccessed ?? 0;
            if (t2 < oldestTime) { oldestTime = t2; oldestKey = k; }
          }
          if (oldestKey) { tileCache.current.get(oldestKey)?.bitmap?.close(); tileCache.current.delete(oldestKey); }
        }
        tileCache.current.set(key, { status: "ready", bitmap, lastAccessed: Date.now() });
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(drawOnly);
      })
      .catch(() => tileCache.current.set(key, { status: "error" }));
  }, []); // eslint-disable-line

  function drawOnly() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const v = vp.current;
    const s = seedRef.current;
    const ver = verRef.current;

    ctx.fillStyle = "#0c0c0f";
    ctx.fillRect(0, 0, W, H);
    if (!activeRef.current || !s) return;

    const tileCanvasPx = TILE_PX * v.zoom;
    const halfBW = (W / 2) * 4 / v.zoom;
    const halfBH = (H / 2) * 4 / v.zoom;
    const tx0 = Math.floor((v.cx - halfBW) / TILE_BLK) * TILE_BLK;
    const tz0 = Math.floor((v.cz - halfBH) / TILE_BLK) * TILE_BLK;
    const tx1 = Math.ceil((v.cx + halfBW) / TILE_BLK) * TILE_BLK;
    const tz1 = Math.ceil((v.cz + halfBH) / TILE_BLK) * TILE_BLK;

    ctx.imageSmoothingEnabled = false;

    const visibleKeys = new Set<string>();
    for (let bx = tx0; bx <= tx1; bx += TILE_BLK) {
      for (let bz = tz0; bz <= tz1; bz += TILE_BLK) {
        const key = `${s}|${ver}|${bx}|${bz}`;
        visibleKeys.add(key);
        const tile = tileCache.current.get(key);
        if (tile?.status === "ready" && tile.bitmap) {
          tile.lastAccessed = Date.now();
          const { px, pz } = b2c(bx, bz, W, H, v);
          ctx.drawImage(tile.bitmap, px, pz, tileCanvasPx, tileCanvasPx);
        }
      }
    }

    const MARGIN = TILE_BLK * 2;
    for (const [key, tile] of tileCache.current) {
      if (visibleKeys.has(key)) continue;
      const parts = key.split("|");
      const kbx = parseInt(parts[2]), kbz = parseInt(parts[3]);
      if (kbx < tx0 - MARGIN || kbx > tx1 + MARGIN || kbz < tz0 - MARGIN || kbz > tz1 + MARGIN) {
        tile.bitmap?.close();
        tileCache.current.delete(key);
      }
    }

    if (showStRef.current) {
      for (const st of structs.current) {
        const { px, pz } = b2c(st.x, st.z, W, H, v);
        if (px < -20 || px > W + 20 || pz < -20 || pz > H + 20) continue;
        const r = Math.max(3, 4 * Math.min(v.zoom, 3));
        ctx.beginPath();
        ctx.arc(px, pz, r, 0, Math.PI * 2);
        ctx.fillStyle = st.color + "ee";
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
        if (v.zoom >= 1) {
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${Math.round(9 + v.zoom)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.9)";
          ctx.shadowBlur = 3;
          ctx.fillText(st.label, px, pz - r - 3);
          ctx.shadowBlur = 0;
        }
      }
    }

    const { px: ox, pz: oz } = b2c(0, 0, W, H, v);
    if (ox > -10 && ox < W + 10 && oz > -10 && oz < H + 10) {
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox, oz - 8); ctx.lineTo(ox, oz + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox - 8, oz); ctx.lineTo(ox + 8, oz); ctx.stroke();
    }
  }

  const scheduleFetch = useCallback(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas || !activeRef.current) return;
      const v = vp.current;
      const s = seedRef.current;
      const ver = verRef.current;
      const W = canvas.width, H = canvas.height;
      const halfBW = (W / 2) * 4 / v.zoom;
      const halfBH = (H / 2) * 4 / v.zoom;
      const tx0 = Math.floor((v.cx - halfBW) / TILE_BLK) * TILE_BLK;
      const tz0 = Math.floor((v.cz - halfBH) / TILE_BLK) * TILE_BLK;
      const tx1 = Math.ceil((v.cx + halfBW) / TILE_BLK) * TILE_BLK;
      const tz1 = Math.ceil((v.cz + halfBH) / TILE_BLK) * TILE_BLK;
      for (let bx = tx0; bx <= tx1; bx += TILE_BLK) {
        for (let bz = tz0; bz <= tz1; bz += TILE_BLK) {
          const key = `${s}|${ver}|${bx}|${bz}`;
          if (!tileCache.current.has(key)) {
            tileCache.current.set(key, { status: "loading" });
            fetchTile(key, bx, bz, s, ver);
          }
        }
      }
    }, FETCH_DEBOUNCE_MS);
  }, [fetchTile]);

  const scheduleDraw = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(drawOnly);
    scheduleFetch();
  }, [scheduleFetch]); // eslint-disable-line

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      scheduleDraw();
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, [scheduleDraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, mz = e.clientY - rect.top;
      const v = vp.current;
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const newZoom = Math.min(16, Math.max(0.1, v.zoom * factor));
      const bx = v.cx + (mx - canvas.width / 2) * 4 / v.zoom;
      const bz = v.cz + (mz - canvas.height / 2) * 4 / v.zoom;
      vp.current.cx = bx - (mx - canvas.width / 2) * 4 / newZoom;
      vp.current.cz = bz - (mz - canvas.height / 2) * 4 / newZoom;
      vp.current.zoom = newZoom;
      scheduleDraw();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [scheduleDraw]);

  const fetchStructures = useCallback(async (s: string, ver: string) => {
    try {
      const data = await api.seedmapStructures(s, 0, 0, 4096, ver);
      setStructures(data);
      structs.current = data;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(drawOnly);
    } catch {}
  }, []); // eslint-disable-line

  const generate = useCallback(async () => {
    const s = seed.trim().slice(0, 64);
    if (!s) return;
    setLoading(true);
    setError(null);
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    tileCache.current.forEach(t => t.bitmap?.close());
    tileCache.current.clear();
    vp.current = { cx: 0, cz: 0, zoom: 2 };
    setStructures([]);
    structs.current = [];
    activeRef.current = true;
    setIsActive(true);
    seedRef.current = s;
    verRef.current = version;
    try {
      scheduleDraw();
      await fetchStructures(s, version);
    } catch {
      setError(t("seedmap.error"));
    } finally {
      setLoading(false);
    }
  }, [seed, version, t, scheduleDraw, fetchStructures]);

  const onMouseDown = (e: React.MouseEvent) => {
    drag.current = true;
    lastPt.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas && activeRef.current) {
      const rect = canvas.getBoundingClientRect();
      const v = vp.current;
      setHoverCoord({
        x: Math.round(v.cx + (e.clientX - rect.left - canvas.width / 2) * 4 / v.zoom),
        z: Math.round(v.cz + (e.clientY - rect.top - canvas.height / 2) * 4 / v.zoom),
      });
    }
    if (!drag.current) return;
    const dx = e.clientX - lastPt.current.x;
    const dz = e.clientY - lastPt.current.y;
    lastPt.current = { x: e.clientX, y: e.clientY };
    vp.current.cx -= dx * 4 / vp.current.zoom;
    vp.current.cz -= dz * 4 / vp.current.zoom;
    scheduleDraw();
  };

  const onMouseUp = () => { drag.current = false; };
  const onMouseLeave = () => { drag.current = false; setHoverCoord(null); };

  const legendItems = Array.from(new Map(structures.map(s => [s.kind, s])).values());

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("seedmap.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("seedmap.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("seedmap.description")}</p>
        </div>

        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="flex-1 min-w-48">
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">{t("seedmap.seedLabel")}</label>
            <input
              type="text"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              onKeyDown={e => e.key === "Enter" && generate()}
              placeholder={t("seedmap.seedPlaceholder")}
              className="w-full rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500/40 focus:outline-none transition-colors"
            />
          </div>

          <div className="w-32">
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">{t("seedmap.versionLabel")}</label>
            {loadingVersions ? (
              <div className="flex items-center gap-2 py-2.5 text-zinc-500"><IconSpinner className="h-3.5 w-3.5" /></div>
            ) : (
              <Select value={version} onChange={setVersion} options={versions.map(v => ({ value: v, label: v }))} disabled={versions.length === 0} />
            )}
          </div>

          <Button
            variant="primaryNormal"
            onClick={generate}
            disabled={!seed.trim() || loading || !version}
          >
            {loading ? <><IconSpinner className="h-4 w-4" />{t("seedmap.generateBtn")}</> : t("seedmap.generateBtn")}
          </Button>

          {isActive && (
            <button
              onClick={() => {
                showStRef.current = !showStRef.current;
                setShowStructures(v => !v);
                cancelAnimationFrame(raf.current);
                raf.current = requestAnimationFrame(drawOnly);
              }}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                showStructures
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {t("seedmap.structures")}
            </button>
          )}
        </div>

        <div
          className="relative rounded-xl border border-white/8 bg-[#0c0c0f] overflow-hidden"
          style={{ height: "62vh", minHeight: 420 }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", width: "100%", height: "100%", cursor: drag.current ? "grabbing" : "crosshair" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />

          {!isActive && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-zinc-600">{t("seedmap.placeholder")}</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
              <IconSpinner className="h-6 w-6 text-emerald-400" />
            </div>
          )}

          {error && (
            <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          {hoverCoord && (
            <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs text-zinc-300 font-mono pointer-events-none select-none">
              X {hoverCoord.x} &nbsp; Z {hoverCoord.z}
            </div>
          )}

          {isActive && (
            <div className="absolute top-3 right-3 rounded-md bg-black/50 px-2 py-1 text-[10px] text-zinc-500 pointer-events-none select-none">
              {t("seedmap.orbitHint")}
            </div>
          )}
        </div>

        {isActive && showStructures && legendItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {legendItems.map(s => (
              <span key={s.kind} className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
}
