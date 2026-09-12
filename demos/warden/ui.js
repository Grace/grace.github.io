import { SCENARIOS } from "./scenarios.js";

const $ = (id) => document.getElementById(id);
const [$trace, $out, $rows, $none, $hint, $who, $blurb, $status] =
  ["trace","out","rows","none","hint","who","blurb","status"].map($);

let scenario = "payout";
let mode = "public";
let ready = false;

// --- what warden held back -------------------------------------------------
// The projection tells you what crossed. Diffing it against the internal
// projection tells you what didn't, which is the part worth seeing.
//
// This asks the engine rather than re-deciding in JavaScript. An earlier
// version of this function carried its own tier table and walked rule.facts,
// which meant it could not see a withheld *parameter* at all: the contract
// schema grew a second term set and this table silently kept reporting one of
// them. Projecting at each tier and diffing is the only version of this that
// cannot drift from what warden actually publishes.
const TIERS = ["public", "partner", "internal"];

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function projectAt(contract, trace, audience) {
  const r = wardenProject(JSON.stringify(contract), JSON.stringify(trace), audience);
  if (!r.ok) return null;
  try { return JSON.parse(r.decision); } catch (e) { return null; }
}

// One addressable entry per published thing, so two projections can be diffed
// by key. Facts and parameters both arrive under `facts` — the engine has
// already merged them by the time it publishes, which is exactly why reading
// its output beats re-deriving from the contract.
function termsOf(decision) {
  const out = new Map();
  if (!decision) return out;
  for (const reason of decision.reasons ?? []) {
    out.set(`reason:${reason.code}`, { kind: "reason", code: reason.code });
    for (const [as, value] of Object.entries(reason.facts ?? {})) {
      out.set(`term:${reason.code}:${as}`, { kind: "term", code: reason.code, as, value });
    }
  }
  for (const key of ["ruleset", "version"]) {
    if (decision[key] !== undefined) {
      out.set(`meta:${key}`, { kind: "meta", as: key, value: decision[key] });
    }
  }
  return out;
}

function heldBack(contract, trace, audience) {
  const byTier = new Map(TIERS.map((t) => [t, termsOf(projectAt(contract, trace, t))]));
  const full = byTier.get("internal");
  const mine = byTier.get(audience) ?? new Map();
  if (!full || !full.size) return [];

  // A reason withheld whole takes its terms with it; listing both would report
  // the same withholding several times.
  const mutedReasons = new Set();
  for (const [id, t] of full) {
    if (t.kind === "reason" && !mine.has(id)) mutedReasons.add(t.code);
  }

  const out = [];
  for (const [id, t] of full) {
    if (mine.has(id)) continue;
    if (t.kind === "term" && mutedReasons.has(t.code)) continue;
    const needs = TIERS.find((tier) => byTier.get(tier).has(id)) ?? "internal";
    out.push({
      rule: t.kind === "meta" ? "—" : esc(t.code),
      what: t.kind === "reason"
        ? `the whole <code>${esc(t.code)}</code> reason`
        : `<code>${esc(t.as)}</code> = <code>${esc(t.value)}</code>`,
      needs,
      why: t.kind === "reason" ? "the reason itself is above this tier"
        : t.kind === "meta" ? (t.as === "ruleset" ? "engine identity" : "ruleset version")
          : `the engine publishes this no lower than <code>${needs}</code>`,
    });
  }
  return out;
}

function render() {
  const s = SCENARIOS[scenario];
  const audience = mode === "__unmapped" ? "public" : mode;
  $hint.textContent = mode === "__unmapped"
    ? "a new rule ships before the contract does"
    : s.tiers[audience];
  $who.textContent = "— to " + (mode === "__unmapped" ? s.tiers.public : s.tiers[audience]);
  $blurb.innerHTML = s.blurb;

  if (!ready) { $out.textContent = "loading warden…"; return; }

  let trace;
  try { trace = JSON.parse($trace.value); }
  catch (e) {
    $out.className = "box refused";
    $out.textContent = "the trace is not valid JSON:\n\n" + e.message;
    $rows.innerHTML = ""; $none.hidden = true; return;
  }

  const r = wardenProject(JSON.stringify(s.contract), JSON.stringify(trace), audience);

  if (!r.ok) {
    $out.className = "box refused";
    $out.textContent = "refused to publish\n\n" + r.error;
    $rows.innerHTML = ""; $none.hidden = true; return;
  }
  $out.className = "box";
  $out.textContent = r.decision;

  const held = heldBack(s.contract, trace, audience);
  $rows.innerHTML = held.map((h) => `<tr>
      <td class="mono">${h.rule}</td>
      <td>${h.what}</td>
      <td><span class="tag t-${h.needs}">${h.needs}</span></td>
      <td>${h.why}</td>
    </tr>`).join("");
  $none.hidden = held.length > 0;
}

function loadTrace() {
  const s = SCENARIOS[scenario];
  const t = structuredClone(s.trace);
  if (mode === "__unmapped") t.firings.push(structuredClone(s.unmapped));
  $trace.value = JSON.stringify(t, null, 2);
}

document.querySelectorAll("button[data-scenario]").forEach((b) =>
  b.addEventListener("click", () => {
    scenario = b.dataset.scenario;
    document.querySelectorAll("button[data-scenario]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)));
    document.querySelectorAll("button[data-a]").forEach((x) =>
      x.textContent = x.dataset.a === "__unmapped" ? "fire an unmapped rule"
        : SCENARIOS[scenario].tiers[x.dataset.a]);
    loadTrace(); render();
  }));

document.querySelectorAll("button[data-a]").forEach((b) =>
  b.addEventListener("click", () => {
    mode = b.dataset.a;
    document.querySelectorAll("button[data-a]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)));
    loadTrace(); render();
  }));

$trace.addEventListener("input", render);

addEventListener("warden-ready", () => {
  ready = true;
  $status.textContent = "warden.wasm loaded — this page runs the real Go";
  render();
});

// Boot the Go runtime.
const go = new Go();
WebAssembly.instantiateStreaming(fetch("./warden.wasm"), go.importObject)
  .then((r) => go.run(r.instance))
  .catch((e) => { $out.className = "box refused"; $out.textContent = "could not load warden.wasm:\n\n" + e; });

document.querySelectorAll("button[data-a]").forEach((x) =>
  x.textContent = x.dataset.a === "__unmapped" ? "fire an unmapped rule"
    : SCENARIOS[scenario].tiers[x.dataset.a]);
loadTrace(); render();
