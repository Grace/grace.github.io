import { INVISIBLE, BIDI, HOMOGLYPH } from "./tables.js";

// A zero-width joiner between two pictographs builds a compound emoji (👨‍💻).
// Flagging those buries real findings under every document containing one.
const pictographic = (cp) =>
  (cp >= 0x1f000 && cp <= 0x1faff) ||
  (cp >= 0x2600 && cp <= 0x27bf) ||
  cp === 0xfe0f || cp === 0xfe0e ||
  (cp >= 0x2640 && cp <= 0x2642);

const KINDS = {
  invisible:   { label: "invisible",    note: "renders as nothing; the model reads it" },
  bidi:        { label: "bidi control", note: "reorders text on screen — Trojan Source" },
  homoglyph:   { label: "homoglyph",    note: "a lookalike from another script" },
  control:     { label: "control",      note: "non-printing control character" },
  format:      { label: "format",       note: "Unicode format character" },
  privateUse:  { label: "private use",  note: "private use area character" },
};

export function scan(text) {
  const chars = Array.from(text);
  const findings = [];
  let line = 1, col = 0;

  chars.forEach((ch, i) => {
    col++;
    if (ch === "\n") { line++; col = 0; return; }
    const cp = ch.codePointAt(0);

    if (ch === "‍") {
      const prev = chars[i - 1], next = chars[i + 1];
      if (prev && next && pictographic(prev.codePointAt(0)) && pictographic(next.codePointAt(0))) return;
    }

    let kind = null, detail = null;
    if (INVISIBLE[ch])      { kind = "invisible";  detail = INVISIBLE[ch]; }
    else if (BIDI[ch])      { kind = "bidi";       detail = BIDI[ch]; }
    else if (HOMOGLYPH[ch]) { kind = "homoglyph";  detail = HOMOGLYPH[ch]; }
    else if (ch === "\t" || ch === "\r") return;
    else if (cp < 0x20 || cp === 0x7f) { kind = "control"; detail = KINDS.control.note; }
    else if (/\p{Cf}/u.test(ch))       { kind = "format";  detail = KINDS.format.note; }
    else if (/\p{Co}/u.test(ch))       { kind = "privateUse"; detail = KINDS.privateUse.note; }

    if (kind) findings.push({ index: i, line, col, ch, cp, kind, detail });
  });
  return findings;
}

export const kindLabel = (k) => KINDS[k].label;

export function summarize(findings) {
  const counts = new Map();
  for (const f of findings) counts.set(f.kind, (counts.get(f.kind) || 0) + 1);
  return [...counts].map(([k, n]) => `${n} ${kindLabel(k)}${n > 1 ? "s" : ""}`).join(", ");
}
