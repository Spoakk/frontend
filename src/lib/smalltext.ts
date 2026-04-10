const MAP: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
  h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
  o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ѕ", t: "ᴛ", u: "ᴜ",
  v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

export function toSmallText(input: string, capitalizeFirst: boolean): string {
  let result = "";
  let isFirst = true;

  for (const char of input) {
    const lower = char.toLowerCase();

    if (capitalizeFirst && isFirst && /[a-z]/i.test(char)) {
      result += char.toUpperCase();
      isFirst = false;
      continue;
    }

    if (char === " ") {
      result += " ";
      if (capitalizeFirst) isFirst = true;
      continue;
    }

    result += MAP[lower] ?? char;

    if (/[a-z]/i.test(char)) isFirst = false;
  }

  return result;
}
