export interface MiniSpan {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

const NAMED_COLORS: Record<string, string> = {
  black: "#000000", dark_blue: "#0000AA", dark_green: "#00AA00",
  dark_aqua: "#00AAAA", dark_red: "#AA0000", dark_purple: "#AA00AA",
  gold: "#FFAA00", gray: "#AAAAAA", dark_gray: "#555555",
  blue: "#5555FF", green: "#55FF55", aqua: "#55FFFF",
  red: "#FF5555", light_purple: "#FF55FF", yellow: "#FFFF55",
  white: "#FFFFFF",
};

function lerpHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

interface StyleState {
  color?: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

function resolveColor(tag: string): string | undefined {
  const t = tag.toLowerCase();
  if (NAMED_COLORS[t]) return NAMED_COLORS[t];
  if (/^#[0-9a-f]{6}$/i.test(tag)) return tag.toLowerCase();
  return undefined;
}

export function parseMiniMessage(input: string): MiniSpan[] {
  const spans: MiniSpan[] = [];
  const stack: StyleState[] = [];

  let current: StyleState = {
    bold: false, italic: false, underline: false,
    strikethrough: false, obfuscated: false,
  };

  const processed = expandGradients(input);

  const tagRegex = /<(\/?)([^>]+)>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(processed)) !== null) {
    if (match.index > lastIndex) {
      const text = processed.slice(lastIndex, match.index);
      if (text) spans.push({ text, ...styleSnapshot(current) });
    }
    lastIndex = tagRegex.lastIndex;

    const closing = match[1] === "/";
    const tagContent = match[2].trim();

    if (closing) {
      if (stack.length > 0) {
        current = stack.pop()!;
      }
    } else {
      stack.push({ ...current });
      applyTag(tagContent, current);
    }
  }

  if (lastIndex < processed.length) {
    const text = processed.slice(lastIndex);
    if (text) spans.push({ text, ...styleSnapshot(current) });
  }

  return spans;
}

function styleSnapshot(s: StyleState): Omit<MiniSpan, "text"> {
  return {
    color: s.color,
    bold: s.bold || undefined,
    italic: s.italic || undefined,
    underline: s.underline || undefined,
    strikethrough: s.strikethrough || undefined,
    obfuscated: s.obfuscated || undefined,
  };
}

function applyTag(tag: string, state: StyleState) {
  const t = tag.toLowerCase();
  if (t === "bold" || t === "b") { state.bold = true; return; }
  if (t === "italic" || t === "i" || t === "em") { state.italic = true; return; }
  if (t === "underlined" || t === "u") { state.underline = true; return; }
  if (t === "strikethrough" || t === "st") { state.strikethrough = true; return; }
  if (t === "obfuscated" || t === "obf") { state.obfuscated = true; return; }
  if (t === "reset") {
    state.bold = false; state.italic = false; state.underline = false;
    state.strikethrough = false; state.obfuscated = false;
    state.color = undefined;
    return;
  }
  const color = resolveColor(tag);
  if (color) { state.color = color; return; }
}

function expandGradients(input: string): string {
  let result = input;
  let safety = 0;
  while (result.includes("<gradient") && safety++ < 20) {
    const start = result.indexOf("<gradient");
    const tagEnd = result.indexOf(">", start);
    if (tagEnd === -1) break;
    const closeTag = "</gradient>";
    const closeIdx = result.indexOf(closeTag, tagEnd);
    if (closeIdx === -1) break;

    const args = result.slice(start + "<gradient".length, tagEnd);
    const content = result.slice(tagEnd + 1, closeIdx);

    const colors = args.split(":").map((s: string) => s.trim()).filter(Boolean).map((c: string) => {
      const resolved = resolveColor(c);
      return resolved ?? "#ffffff";
    });

    let replacement: string;
    if (colors.length < 2) {
      replacement = content;
    } else {
      const plainText = content.replace(/<[^>]+>/g, "");
      if (plainText.length === 0) {
        replacement = content;
      } else {
        let built = "";
        for (let i = 0; i < plainText.length; i++) {
          const t = i / Math.max(plainText.length - 1, 1);
          const segment = t * (colors.length - 1);
          const idx = Math.floor(segment);
          const localT = segment - idx;
          const color = lerpHex(
            colors[Math.min(idx, colors.length - 1)],
            colors[Math.min(idx + 1, colors.length - 1)],
            localT,
          );
          built += `<${color}>${plainText[i]}</${color}>`;
        }
        replacement = built;
      }
    }

    result = result.slice(0, start) + replacement + result.slice(closeIdx + closeTag.length);
  }
  return result;
}

export function stripMiniMessage(input: string): string {
  return input.replace(/<[^>]+>/g, "");
}
