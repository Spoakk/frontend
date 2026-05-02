"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { parseMiniMessage, stripMiniMessage, MiniSpan } from "@/lib/minimessage";
import { useToast } from "@/components/ui/Toast";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/Card";
import { GradientPicker } from "@/components/minimessage/GradientPicker";

const EXAMPLES = [
  "<gradient:#ff6b6b:#ffd93d>Hello, World!</gradient>",
  "<red>Error: </red><white>Something went wrong</white>",
  "<gold><bold>Welcome</bold></gold> <gray>to the server!</gray>",
  "<gradient:#55FF55:#00AA00>Online</gradient> <dark_gray>|</dark_gray> <white>24 players</white>",
  "<aqua><underlined>Click here</underlined></aqua> <yellow>to vote!</yellow>",
];

const NAMED_COLORS = [
  { name: "red",          hex: "#FF5555" },
  { name: "gold",         hex: "#FFAA00" },
  { name: "yellow",       hex: "#FFFF55" },
  { name: "green",        hex: "#55FF55" },
  { name: "aqua",         hex: "#55FFFF" },
  { name: "blue",         hex: "#5555FF" },
  { name: "light_purple", hex: "#FF55FF" },
  { name: "white",        hex: "#FFFFFF" },
  { name: "gray",         hex: "#AAAAAA" },
  { name: "dark_gray",    hex: "#555555" },
  { name: "dark_red",     hex: "#AA0000" },
  { name: "dark_green",   hex: "#00AA00" },
  { name: "dark_aqua",    hex: "#00AAAA" },
  { name: "dark_blue",    hex: "#0000AA" },
  { name: "dark_purple",  hex: "#AA00AA" },
] as const;

const FORMAT_BUTTONS = [
  { label: "B",     title: "Bold",          open: "<bold>",          close: "</bold>",          cls: "font-bold" },
  { label: "I",     title: "Italic",        open: "<italic>",        close: "</italic>",        cls: "italic" },
  { label: "U",     title: "Underline",     open: "<underlined>",    close: "</underlined>",    cls: "underline" },
  { label: "S",     title: "Strikethrough", open: "<strikethrough>", close: "</strikethrough>", cls: "line-through" },
  { label: "***",   title: "Obfuscated",    open: "<obfuscated>",    close: "</obfuscated>",    cls: "blur-[2px]" },
  { label: "Reset", title: "Reset",         open: "<reset>",         close: "",                 cls: "" },
] as const;

const TAG_REF = [
  ["<red>",                "İsimli renk"],
  ["<#ff0000>",            "Hex renk"],
  ["<bold> / <b>",         "Kalın"],
  ["<italic> / <i>",       "İtalik"],
  ["<underlined> / <u>",   "Altı çizili"],
  ["<strikethrough> / <st>","Üstü çizili"],
  ["<obfuscated> / <obf>", "Gizlenmiş"],
  ["<gradient:#f00:#00f>", "Gradyan"],
  ["<reset>",              "Tüm stilleri sıfırla"],
] as const;

function PreviewSpan({ span }: { span: MiniSpan }) {
  const style: React.CSSProperties = {};
  if (span.color) style.color = span.color;
  if (span.bold) style.fontWeight = "bold";
  if (span.italic) style.fontStyle = "italic";
  const dec: string[] = [];
  if (span.underline) dec.push("underline");
  if (span.strikethrough) dec.push("line-through");
  if (dec.length) style.textDecoration = dec.join(" ");
  if (span.obfuscated) return <span style={style} className="blur-[2px] select-none font-mono">{span.text}</span>;
  return <span style={style}>{span.text}</span>;
}

function getSelection(el: HTMLTextAreaElement) {
  return { start: el.selectionStart, end: el.selectionEnd, text: el.value.slice(el.selectionStart, el.selectionEnd) };
}

function stripColorTags(text: string): string {
  const names = ["black","dark_blue","dark_green","dark_aqua","dark_red","dark_purple","gold","gray","dark_gray","blue","green","aqua","red","light_purple","yellow","white"];
  return text
    .replace(new RegExp(`</?(?:${names.join("|")})>`, "gi"), "")
    .replace(/<\/?#[0-9a-fA-F]{6}>/g, "")
    .replace(/<\/?gradient[^>]*>/gi, "");
}

function wrapOrInsert(value: string, el: HTMLTextAreaElement, open: string, close: string, fallback: string, hasSel: boolean) {
  const { start, end, text } = getSelection(el);
  if (hasSel && text) {
    const wrapped = open + text + close;
    return { newValue: value.slice(0, start) + wrapped + value.slice(end), newCursor: start + wrapped.length };
  }
  const insert = open + fallback + close;
  return { newValue: value.slice(0, start) + insert + value.slice(start), newCursor: start + open.length + fallback.length };
}

function wrapColorReplace(value: string, el: HTMLTextAreaElement, open: string, close: string, fallback: string, hasSel: boolean) {
  const { start, end, text } = getSelection(el);
  if (hasSel && text) {
    const wrapped = open + stripColorTags(text) + close;
    return { newValue: value.slice(0, start) + wrapped + value.slice(end), newCursor: start + wrapped.length };
  }
  const insert = open + fallback + close;
  return { newValue: value.slice(0, start) + insert + value.slice(start), newCursor: start + open.length + fallback.length };
}

export default function MiniMessagePage() {
  const { t } = useTranslation();
  const [input, setInput] = useState(EXAMPLES[0]);
  const [gradientColors, setGradientColors] = useState(["#ff6b6b", "#ffd93d"]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const spans = useMemo(() => parseMiniMessage(input), [input]);
  const plain = useMemo(() => stripMiniMessage(input), [input]);

  const apply = (open: string, close: string, fallback: string) => {
    const el = textareaRef.current; if (!el) return;
    const { text } = getSelection(el); const hasSel = text.length > 0;
    if (!hasSel) toast(t("minimessage.selectFirst"), "info");
    const { newValue, newCursor } = wrapOrInsert(input, el, open, close, fallback, hasSel);
    setInput(newValue);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(newCursor, newCursor); });
  };

  const applyColor = (name: string) => {
    const el = textareaRef.current; if (!el) return;
    const { text } = getSelection(el); const hasSel = text.length > 0;
    if (!hasSel) toast(t("minimessage.selectFirst"), "info");
    const { newValue, newCursor } = wrapColorReplace(input, el, `<${name}>`, `</${name}>`, "text", hasSel);
    setInput(newValue);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(newCursor, newCursor); });
  };

  const applyGradient = () => {
    const el = textareaRef.current; if (!el) return;
    const { text } = getSelection(el); const hasSel = text.length > 0;
    if (!hasSel) toast(t("minimessage.selectFirst"), "info");
    const tag = `<gradient:${gradientColors.join(":")}>`;
    const { newValue, newCursor } = wrapColorReplace(input, el, tag, `</gradient>`, "text", hasSel);
    setInput(newValue);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(newCursor, newCursor); });
  };

  const spanCount = `${spans.length} ${spans.length !== 1 ? t("minimessage.spansPlural") : t("minimessage.spans")}`;

  return (
    <div className="min-h-screen bg-[#0c0c0f] px-6 py-10 md:py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("minimessage.badge")}
          </span>
          <h1 className="text-2xl font-bold text-white">{t("minimessage.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("minimessage.description")}</p>
        </div>

        <SectionCard className="mb-5" bodyClassName="p-0">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.07]">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("minimessage.format")}</p>
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_BUTTONS.map(({ label, title, open, close, cls }) => (
                <button key={title} onClick={() => apply(open, close, "text")} title={title}
                  className={`rounded-md border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-300 transition-all ${cls}`}
                >{label}</button>
              ))}
            </div>
          </div>

          <div className="px-4 pt-3 pb-3 border-b border-white/[0.07]">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("minimessage.colors")}</p>
            <div className="flex flex-wrap gap-2">
              {NAMED_COLORS.map(({ name, hex }) => (
                <button key={name} onClick={() => applyColor(name)} title={name}
                  className="h-6 w-6 rounded-md border border-white/10 hover:scale-125 hover:border-white/30 transition-all"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <div className="px-4 pt-3 pb-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2.5">{t("minimessage.gradient")}</p>
            <GradientPicker
              colors={gradientColors}
              onChange={setGradientColors}
              onApply={applyGradient}
              applyLabel={t("minimessage.applyGradient")}
            />
          </div>
        </SectionCard>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {EXAMPLES.map((_, i) => (
            <button key={i} onClick={() => setInput(EXAMPLES[i])}
              className="rounded-md border border-white/8 bg-white/[0.02] px-3 py-1 text-xs text-zinc-500 hover:border-white/15 hover:text-zinc-300 transition-colors"
            >{t("minimessage.examples")} {i + 1}</button>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-zinc-400">{t("minimessage.inputLabel")}</label>
            <CopyButton textToCopy={input} successMessage={t("common.copied")} className="text-xs text-zinc-500 hover:text-white transition-colors">
              {t("common.copy")}
            </CopyButton>
          </div>
          <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)}
            rows={4} spellCheck={false}
            className="w-full rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-zinc-200 font-mono placeholder-zinc-700 focus:border-emerald-500/40 focus:outline-none transition-colors resize-none"
            placeholder="<red>Hello</red> <bold>World</bold>"
          />
        </div>

        <SectionCard
          className="mb-3"
          header={
            <>
              <span className="text-xs font-medium text-zinc-400">{t("minimessage.preview")}</span>
              <span className="text-xs text-zinc-600 font-mono">{spanCount}</span>
            </>
          }
          bodyClassName="px-5 py-5 min-h-[64px] flex items-center"
        >
          <p className="text-base leading-relaxed break-all" style={{ fontFamily: 'MinecraftAlt, Minecraft, monospace' }}>
            {spans.length > 0
              ? spans.map((span, i) => <PreviewSpan key={i} span={span} />)
              : <span className="text-zinc-700 text-sm">Start typing...</span>
            }
          </p>
        </SectionCard>

        {plain && (
          <SectionCard
            className="mb-5"
            header={<span className="text-xs font-medium text-zinc-400">{t("minimessage.plainText")}</span>}
            bodyClassName="px-5 py-3.5"
          >
            <p className="text-sm text-zinc-500 font-mono break-all">{plain}</p>
          </SectionCard>
        )}

        <details className="group">
          <summary className="cursor-pointer text-xs text-zinc-600 hover:text-zinc-400 transition-colors list-none flex items-center gap-1.5 select-none">
            <svg className="h-3 w-3 transition-transform group-open:rotate-90 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {t("minimessage.tagRef")}
          </summary>
          <SectionCard className="mt-2" bodyClassName="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
              {TAG_REF.map(([tag, desc]) => (
                <div key={tag} className="flex items-center gap-2">
                  <span className="text-emerald-400 shrink-0">{tag}</span>
                  <span className="text-zinc-600">{desc}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </details>

      </motion.div>
    </div>
  );
}
