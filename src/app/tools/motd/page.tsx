"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/Toast";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/Card";
import { parseMiniMessage, MiniSpan } from "@/lib/minimessage";
import { GradientPicker } from "@/components/minimessage/GradientPicker";

const EXAMPLES_LEGACY = [
  {
    line1: "§6§lWelcome to §e§lMy Server",
    line2: "§7Join us for §a§lfun§7!",
  },
  {
    line1: "§b§m                §r §c§lSURVIVAL§r §b§m                ",
    line2: "§7Online §a24/7 §8| §7Version §e1.21",
  },
  {
    line1: "§d§l✦ §5§lPURPLE §d§lNETWORK §d§l✦",
    line2: "§7New §6§lSEASON §7starting soon!",
  },
];

const EXAMPLES_MINI = [
  {
    line1: "<gradient:#ff6b6b:#ffd93d>Welcome to My Server</gradient>",
    line2: "<gray>Join us for <green><bold>fun</bold></green>!</gray>",
  },
  {
    line1: "<aqua><strikethrough>                </strikethrough></aqua> <red><bold>SURVIVAL</bold></red> <aqua><strikethrough>                </strikethrough></aqua>",
    line2: "<gray>Online <green>24/7</green> <dark_gray>|</dark_gray> Version <yellow>1.21</yellow></gray>",
  },
  {
    line1: "<light_purple><bold>✦</bold></light_purple> <gradient:#a855f7:#ec4899>PURPLE NETWORK</gradient> <light_purple><bold>✦</bold></light_purple>",
    line2: "<gray>New <gold><bold>SEASON</bold></gold> starting soon!</gray>",
  },
];

const NAMED_COLORS_LEGACY = [
  { name: "§0", label: "Black", hex: "#000000" },
  { name: "§1", label: "Dark Blue", hex: "#0000AA" },
  { name: "§2", label: "Dark Green", hex: "#00AA00" },
  { name: "§3", label: "Dark Aqua", hex: "#00AAAA" },
  { name: "§4", label: "Dark Red", hex: "#AA0000" },
  { name: "§5", label: "Dark Purple", hex: "#AA00AA" },
  { name: "§6", label: "Gold", hex: "#FFAA00" },
  { name: "§7", label: "Gray", hex: "#AAAAAA" },
  { name: "§8", label: "Dark Gray", hex: "#555555" },
  { name: "§9", label: "Blue", hex: "#5555FF" },
  { name: "§a", label: "Green", hex: "#55FF55" },
  { name: "§b", label: "Aqua", hex: "#55FFFF" },
  { name: "§c", label: "Red", hex: "#FF5555" },
  { name: "§d", label: "Light Purple", hex: "#FF55FF" },
  { name: "§e", label: "Yellow", hex: "#FFFF55" },
  { name: "§f", label: "White", hex: "#FFFFFF" },
] as const;

const NAMED_COLORS_MINI = [
  { name: "black", hex: "#000000" },
  { name: "dark_blue", hex: "#0000AA" },
  { name: "dark_green", hex: "#00AA00" },
  { name: "dark_aqua", hex: "#00AAAA" },
  { name: "dark_red", hex: "#AA0000" },
  { name: "dark_purple", hex: "#AA00AA" },
  { name: "gold", hex: "#FFAA00" },
  { name: "gray", hex: "#AAAAAA" },
  { name: "dark_gray", hex: "#555555" },
  { name: "blue", hex: "#5555FF" },
  { name: "green", hex: "#55FF55" },
  { name: "aqua", hex: "#55FFFF" },
  { name: "red", hex: "#FF5555" },
  { name: "light_purple", hex: "#FF55FF" },
  { name: "yellow", hex: "#FFFF55" },
  { name: "white", hex: "#FFFFFF" },
] as const;

const FORMAT_CODES_LEGACY = [
  { code: "§l", label: "B", title: "Bold", cls: "font-bold" },
  { code: "§o", label: "I", title: "Italic", cls: "italic" },
  { code: "§n", label: "U", title: "Underline", cls: "underline" },
  { code: "§m", label: "S", title: "Strikethrough", cls: "line-through" },
  { code: "§k", label: "***", title: "Obfuscated", cls: "blur-[2px]" },
  { code: "§r", label: "Reset", title: "Reset", cls: "" },
] as const;

const FORMAT_CODES_MINI = [
  { open: "<bold>", close: "</bold>", label: "B", title: "Bold", cls: "font-bold" },
  { open: "<italic>", close: "</italic>", label: "I", title: "Italic", cls: "italic" },
  { open: "<underlined>", close: "</underlined>", label: "U", title: "Underline", cls: "underline" },
  { open: "<strikethrough>", close: "</strikethrough>", label: "S", title: "Strikethrough", cls: "line-through" },
  { open: "<obfuscated>", close: "</obfuscated>", label: "***", title: "Obfuscated", cls: "blur-[2px]" },
  { open: "<reset>", close: "", label: "Reset", title: "Reset", cls: "" },
] as const;

interface MOTDSpan {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

function parseLegacyMOTD(text: string): MOTDSpan[] {
  const spans: MOTDSpan[] = [];
  let currentSpan: MOTDSpan = { text: "" };
  let i = 0;

  while (i < text.length) {
    if (text[i] === "§" && i + 1 < text.length) {
      const code = text[i + 1];
      
      if (currentSpan.text) {
        spans.push(currentSpan);
        currentSpan = { text: "" };
      }
      
      if (code === "r") {
        currentSpan = { text: "" };
      } else if ("0123456789abcdef".includes(code)) {
        const colorMap: Record<string, string> = {
          "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
          "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
          "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
          "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF",
        };
        currentSpan.color = colorMap[code];
      } else if (code === "l") {
        currentSpan.bold = true;
      } else if (code === "o") {
        currentSpan.italic = true;
      } else if (code === "n") {
        currentSpan.underline = true;
      } else if (code === "m") {
        currentSpan.strikethrough = true;
      } else if (code === "k") {
        currentSpan.obfuscated = true;
      }
      
      i += 2;
    } else {
      currentSpan.text += text[i];
      i++;
    }
  }

  if (currentSpan.text) {
    spans.push(currentSpan);
  }

  return spans;
}

function MOTDPreviewSpan({ span }: { span: MiniSpan | MOTDSpan }) {
  const style: React.CSSProperties = {};
  if (span.color) style.color = span.color;
  if (span.bold) style.fontWeight = "bold";
  if (span.italic) style.fontStyle = "italic";
  const dec: string[] = [];
  if (span.underline) dec.push("underline");
  if (span.strikethrough) dec.push("line-through");
  if (dec.length) style.textDecoration = dec.join(" ");
  
  if (span.obfuscated) {
    return <span style={style} className="blur-[2px] select-none font-mono">{span.text}</span>;
  }
  
  return <span style={style}>{span.text}</span>;
}

function getSelection(el: HTMLInputElement) {
  return { start: el.selectionStart || 0, end: el.selectionEnd || 0, text: el.value.slice(el.selectionStart || 0, el.selectionEnd || 0) };
}

function insertCode(value: string, el: HTMLInputElement, code: string, hasSel: boolean) {
  const { start, end } = getSelection(el);
  if (hasSel) {
    return { newValue: value.slice(0, start) + code + value.slice(start, end) + value.slice(end), newCursor: start + code.length };
  }
  return { newValue: value.slice(0, start) + code + value.slice(start), newCursor: start + code.length };
}

function wrapSelection(value: string, el: HTMLInputElement, open: string, close: string, fallback: string, hasSel: boolean) {
  const { start, end, text } = getSelection(el);
  if (hasSel && text) {
    const wrapped = open + text + close;
    return { newValue: value.slice(0, start) + wrapped + value.slice(end), newCursor: start + wrapped.length };
  }
  const insert = open + fallback + close;
  return { newValue: value.slice(0, start) + insert + value.slice(start), newCursor: start + open.length + fallback.length };
}

export default function MOTDPage() {
  const { t } = useTranslation();
  const [formatType, setFormatType] = useState<"legacy" | "minimessage">("legacy");
  const [line1, setLine1] = useState(EXAMPLES_LEGACY[0].line1);
  const [line2, setLine2] = useState(EXAMPLES_LEGACY[0].line2);
  const [outputFormat, setOutputFormat] = useState<"vanilla" | "minimotd">("vanilla");
  const [gradientColors, setGradientColors] = useState(["#ff6b6b", "#ffd93d"]);
  const line1Ref = useRef<HTMLInputElement>(null);
  const line2Ref = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const line1Spans = useMemo(() => {
    return formatType === "legacy" ? parseLegacyMOTD(line1) : parseMiniMessage(line1);
  }, [line1, formatType]);

  const line2Spans = useMemo(() => {
    return formatType === "legacy" ? parseLegacyMOTD(line2) : parseMiniMessage(line2);
  }, [line2, formatType]);

  const vanillaOutput = useMemo(() => {
    const motdString = line1 + "\\n" + line2;
    return `motd=${motdString}`;
  }, [line1, line2]);

  const minimotdOutput = useMemo(() => {
    return `motds=[\n    {\n        icon=random\n        line1="${line1}"\n        line2="${line2}"\n    }\n]`;
  }, [line1, line2]);

  const currentOutput = outputFormat === "vanilla" ? vanillaOutput : minimotdOutput;

  const applyLegacyCode = (lineRef: React.RefObject<HTMLInputElement | null>, lineValue: string, setLineValue: (v: string) => void, code: string) => {
    const el = lineRef.current;
    if (!el) return;
    
    const { text } = getSelection(el);
    const hasSel = text.length > 0;
    
    if (!hasSel && (code !== "§r")) {
      toast(t("motd.selectFirst"), "info");
    }
    
    const { newValue, newCursor } = insertCode(lineValue, el, code, hasSel);
    setLineValue(newValue);
    
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor);
    });
  };

  const applyMiniFormat = (lineRef: React.RefObject<HTMLInputElement | null>, lineValue: string, setLineValue: (v: string) => void, open: string, close: string) => {
    const el = lineRef.current;
    if (!el) return;
    
    const { text } = getSelection(el);
    const hasSel = text.length > 0;
    
    if (!hasSel && close) {
      toast(t("motd.selectFirst"), "info");
    }
    
    const { newValue, newCursor } = wrapSelection(lineValue, el, open, close, "text", hasSel);
    setLineValue(newValue);
    
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor);
    });
  };

  const applyMiniColor = (lineRef: React.RefObject<HTMLInputElement | null>, lineValue: string, setLineValue: (v: string) => void, colorName: string) => {
    applyMiniFormat(lineRef, lineValue, setLineValue, `<${colorName}>`, `</${colorName}>`);
  };

  const applyGradient = () => {
    const el = line1Ref.current;
    if (!el) return;
    
    const { text } = getSelection(el);
    const hasSel = text.length > 0;
    
    if (!hasSel) {
      toast(t("motd.selectFirst"), "info");
      return;
    }
    
    const tag = `<gradient:${gradientColors.join(":")}>`;
    const { newValue, newCursor } = wrapSelection(line1, el, tag, `</gradient>`, "text", hasSel);
    setLine1(newValue);
    
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newCursor, newCursor);
    });
  };

  const switchFormat = (newFormat: "legacy" | "minimessage") => {
    setFormatType(newFormat);
    if (newFormat === "legacy") {
      setLine1(EXAMPLES_LEGACY[0].line1);
      setLine2(EXAMPLES_LEGACY[0].line2);
    } else {
      setLine1(EXAMPLES_MINI[0].line1);
      setLine2(EXAMPLES_MINI[0].line2);
    }
  };

  const loadExample = (index: number) => {
    if (formatType === "legacy") {
      setLine1(EXAMPLES_LEGACY[index].line1);
      setLine2(EXAMPLES_LEGACY[index].line2);
    } else {
      setLine1(EXAMPLES_MINI[index].line1);
      setLine2(EXAMPLES_MINI[index].line2);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("motd.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("motd.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("motd.description")}</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button
            onClick={() => switchFormat("legacy")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              formatType === "legacy"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-white/5 text-zinc-500 border border-white/8 hover:border-white/15 hover:text-zinc-300"
            }`}
          >
            <div className="font-semibold mb-0.5">Legacy (§)</div>
            <div className="text-[10px] text-zinc-600">Vanilla Minecraft</div>
          </button>
          <button
            onClick={() => switchFormat("minimessage")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              formatType === "minimessage"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-white/5 text-zinc-500 border border-white/8 hover:border-white/15 hover:text-zinc-300"
            }`}
          >
            <div className="font-semibold mb-0.5">MiniMessage</div>
            <div className="text-[10px] text-zinc-600">Paper/Velocity</div>
          </button>
        </div>

        <SectionCard className="mb-5" bodyClassName="p-0">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.07]">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("motd.format")}</p>
            <div className="flex flex-wrap gap-1.5">
              {formatType === "legacy" ? (
                FORMAT_CODES_LEGACY.map(({ code, label, title, cls }) => (
                  <button
                    key={code}
                    onClick={() => applyLegacyCode(line1Ref, line1, setLine1, code)}
                    title={title}
                    className={`rounded-md border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-300 transition-all ${cls}`}
                  >
                    {label}
                  </button>
                ))
              ) : (
                FORMAT_CODES_MINI.map(({ open, close, label, title, cls }) => (
                  <button
                    key={open}
                    onClick={() => applyMiniFormat(line1Ref, line1, setLine1, open, close)}
                    title={title}
                    className={`rounded-md border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-300 transition-all ${cls}`}
                  >
                    {label}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="px-4 pt-3 pb-3 border-b border-white/[0.07]">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("motd.colors")}</p>
            <div className="flex flex-wrap gap-2">
              {formatType === "legacy" ? (
                NAMED_COLORS_LEGACY.map(({ name, label, hex }) => (
                  <button
                    key={name}
                    onClick={() => applyLegacyCode(line1Ref, line1, setLine1, name)}
                    title={label}
                    className="h-6 w-6 rounded-md border border-white/10 hover:scale-125 hover:border-white/30 transition-all"
                    style={{ backgroundColor: hex }}
                  />
                ))
              ) : (
                NAMED_COLORS_MINI.map(({ name, hex }) => (
                  <button
                    key={name}
                    onClick={() => applyMiniColor(line1Ref, line1, setLine1, name)}
                    title={name}
                    className="h-6 w-6 rounded-md border border-white/10 hover:scale-125 hover:border-white/30 transition-all"
                    style={{ backgroundColor: hex }}
                  />
                ))
              )}
            </div>
          </div>

          {formatType === "minimessage" && (
            <div className="px-4 pt-3 pb-4">
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("motd.gradient")}</p>
              <GradientPicker
                colors={gradientColors}
                onChange={setGradientColors}
                onApply={applyGradient}
                applyLabel={t("motd.applyGradient")}
              />
            </div>
          )}
        </SectionCard>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {(formatType === "legacy" ? EXAMPLES_LEGACY : EXAMPLES_MINI).map((_, i) => (
            <button
              key={i}
              onClick={() => loadExample(i)}
              className="rounded-md border border-white/8 bg-white/2 px-3 py-1 text-xs text-zinc-500 hover:border-white/15 hover:text-zinc-300 transition-colors"
            >
              {t("motd.examples")} {i + 1}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-zinc-400 mb-2 block">{t("motd.line1Label")}</label>
          <input
            ref={line1Ref}
            type="text"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder={t("motd.line1Placeholder")}
            className="w-full rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-zinc-200 font-mono placeholder-zinc-700 focus:border-emerald-500/40 focus:outline-none transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-zinc-400 mb-2 block">{t("motd.line2Label")}</label>
          <input
            ref={line2Ref}
            type="text"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder={t("motd.line2Placeholder")}
            className="w-full rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-zinc-200 font-mono placeholder-zinc-700 focus:border-emerald-500/40 focus:outline-none transition-colors"
          />
        </div>

        <SectionCard
          className="mb-3"
          header={<span className="text-xs font-medium text-zinc-400">{t("motd.preview")}</span>}
          bodyClassName="px-5 py-5 bg-[#313233] min-h-[80px]"
        >
          <p className="text-xs text-zinc-600 mb-3">{t("motd.previewDesc")}</p>
          <div className="space-y-0.5">
            <p className="text-base leading-tight break-all" style={{ fontFamily: 'MinecraftAlt, Minecraft, monospace', letterSpacing: '-0.5px' }}>
              {line1Spans.length > 0
                ? line1Spans.map((span, i) => <MOTDPreviewSpan key={i} span={span} />)
                : <span className="text-zinc-700">Line 1...</span>
              }
            </p>
            <p className="text-base leading-tight break-all" style={{ fontFamily: 'MinecraftAlt, Minecraft, monospace', letterSpacing: '-0.5px' }}>
              {line2Spans.length > 0
                ? line2Spans.map((span, i) => <MOTDPreviewSpan key={i} span={span} />)
                : <span className="text-zinc-700">Line 2...</span>
              }
            </p>
          </div>
        </SectionCard>

        <SectionCard
          className="mb-5"
          header={
            <>
              <span className="text-xs font-medium text-zinc-400">{t("motd.output")}</span>
              <CopyButton textToCopy={currentOutput} successMessage={t("common.copied")} className="text-xs text-zinc-500 hover:text-white transition-colors">
                {t("common.copy")}
              </CopyButton>
            </>
          }
          bodyClassName="p-0"
        >
          <div className="px-4 pt-3 pb-3 border-b border-white/[0.07]">
            <div className="flex gap-2">
              <button
                onClick={() => setOutputFormat("vanilla")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  outputFormat === "vanilla"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-zinc-500 border border-white/8 hover:border-white/15 hover:text-zinc-300"
                }`}
              >
                <div className="font-semibold mb-0.5">Vanilla</div>
                <div className="text-[10px] text-zinc-600">server.properties</div>
              </button>
              <button
                onClick={() => setOutputFormat("minimotd")}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  outputFormat === "minimotd"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-zinc-500 border border-white/8 hover:border-white/15 hover:text-zinc-300"
                }`}
              >
                <div className="font-semibold mb-0.5">MiniMOTD</div>
                <div className="text-[10px] text-zinc-600">main.conf</div>
              </button>
            </div>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-xs text-zinc-600 mb-3">
              {outputFormat === "vanilla" ? t("motd.vanillaDesc") : t("motd.minimotdDesc")}
            </p>
            <div className="rounded-lg bg-black/30 px-3 py-2.5 overflow-x-auto">
              <code className="text-xs text-zinc-300 font-mono break-all whitespace-pre-wrap">{currentOutput}</code>
            </div>
          </div>
        </SectionCard>

      </motion.div>
    </div>
  );
}
