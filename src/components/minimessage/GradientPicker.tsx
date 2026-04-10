"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui/Button";

const PRESET_COLORS = [
  "#ff6b6b", "#ff9f43", "#ffd93d", "#6bcb77", "#4d96ff",
  "#a855f7", "#ec4899", "#ffffff", "#aaaaaa", "#555555",
  "#FF5555", "#FFAA00", "#55FF55", "#55FFFF", "#FF55FF",
];

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#888888";
  const r = parseInt(clean.slice(1, 3), 16) / 255;
  const g = parseInt(clean.slice(3, 5), 16) / 255;
  const b = parseInt(clean.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label: string;
  onRemove?: () => void;
}

function ColorPicker({ value, onChange, label, onRemove }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [hexInput, setHexInput] = useState(value);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const draggingSv = useRef(false);
  const draggingHue = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    setHsv(hexToHsv(value));
    setHexInput(value);
  }, [value]);

  const openPicker = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setRect({ top: r.bottom + 8, left: r.left });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const updateFromSv = useCallback((e: MouseEvent | React.MouseEvent, el: HTMLDivElement) => {
    const r = el.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
    const next: [number, number, number] = [hsv[0], s, v];
    setHsv(next);
    const hex = hsvToHex(...next);
    setHexInput(hex);
    onChange(hex);
  }, [hsv, onChange]);

  const updateFromHue = useCallback((e: MouseEvent | React.MouseEvent, el: HTMLDivElement) => {
    const r = el.getBoundingClientRect();
    const h = Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360));
    const next: [number, number, number] = [h, hsv[1], hsv[2]];
    setHsv(next);
    const hex = hsvToHex(...next);
    setHexInput(hex);
    onChange(hex);
  }, [hsv, onChange]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingSv.current && svRef.current) updateFromSv(e, svRef.current);
      if (draggingHue.current && hueRef.current) updateFromHue(e, hueRef.current);
    };
    const onUp = () => { draggingSv.current = false; draggingHue.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [updateFromSv, updateFromHue]);

  const hueColor = hsvToHex(hsv[0], 1, 1);

  const popover = open && rect && (
    <div
      ref={popoverRef}
      style={{ position: "fixed", top: rect.top, left: rect.left, zIndex: 9999 }}
      className="w-56 rounded-xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/80 overflow-hidden"
    >
      <div
        ref={svRef}
        className="relative h-36 cursor-crosshair select-none"
        style={{ background: `linear-gradient(to right, #fff, ${hueColor})` }}
        onMouseDown={(e) => { draggingSv.current = true; updateFromSv(e, svRef.current!); }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
        <div
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{ left: `${hsv[1] * 100}%`, top: `${(1 - hsv[2]) * 100}%`, backgroundColor: value }}
        />
      </div>
      <div className="px-3 py-3 space-y-3">
        <div
          ref={hueRef}
          className="relative h-3 rounded-full cursor-pointer select-none"
          style={{ background: "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }}
          onMouseDown={(e) => { draggingHue.current = true; updateFromHue(e, hueRef.current!); }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{ left: `${(hsv[0] / 360) * 100}%`, backgroundColor: hueColor }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md border border-white/15 shrink-0" style={{ backgroundColor: value }} />
          <input
            value={hexInput}
            onChange={(e) => {
              setHexInput(e.target.value);
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                setHsv(hexToHsv(e.target.value));
                onChange(e.target.value);
              }
            }}
            className="flex-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs font-mono text-zinc-200 focus:border-emerald-500/40 focus:outline-none"
            maxLength={7}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { onChange(c); setHsv(hexToHsv(c)); setHexInput(c); }}
              className={cn(
                "h-5 w-5 rounded border transition-all hover:scale-110",
                value === c ? "border-white/60 scale-110" : "border-white/10"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex items-center gap-1">
      <button
        ref={triggerRef}
        onClick={openPicker}
        title={label}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 hover:border-white/20 transition-colors"
      >
        <span className="h-4 w-4 rounded border border-white/20 shrink-0" style={{ backgroundColor: value }} />
        <span className="text-xs font-mono text-zinc-500">{value}</span>
      </button>
      {onRemove && (
        <button
          onClick={onRemove}
          className="h-5 w-5 flex items-center justify-center rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
          title="Rengi kaldır"
        >
          ×
        </button>
      )}
      {typeof document !== "undefined" && popover && createPortal(popover, document.body)}
    </div>
  );
}

export interface GradientPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  onApply: () => void;
  applyLabel: string;
}

export function GradientPicker({ colors, onChange, onApply, applyLabel }: GradientPickerProps) {
  const updateColor = (i: number, hex: string) => {
    const next = [...colors];
    next[i] = hex;
    onChange(next);
  };

  const addColor = () => {
    onChange([...colors, "#ffffff"]);
  };

  const removeColor = (i: number) => {
    if (colors.length <= 2) return;
    onChange(colors.filter((_, idx) => idx !== i));
  };

  const gradientCss = colors.length === 1
    ? colors[0]
    : `linear-gradient(to right, ${colors.join(", ")})`;

  return (
    <div className="space-y-3">
      <div
        className="h-7 w-full rounded-lg border border-white/8"
        style={{ background: gradientCss }}
      />

      <div className="flex flex-wrap items-center gap-2">
        {colors.map((c, i) => (
          <ColorPicker
            key={i}
            value={c}
            onChange={(hex) => updateColor(i, hex)}
            label={`Renk ${i + 1}`}
            onRemove={colors.length > 2 ? () => removeColor(i) : undefined}
          />
        ))}

        {colors.length < 6 && (
          <button
            onClick={addColor}
            className="flex items-center gap-1 rounded-lg border border-dashed border-white/15 px-2.5 py-1.5 text-xs text-zinc-600 hover:border-white/30 hover:text-zinc-400 transition-colors"
            title="Renk ekle"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ekle
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={onApply}
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
        >
          {applyLabel}
        </button>
      </div>
    </div>
  );
}
