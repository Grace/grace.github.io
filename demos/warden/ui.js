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
function heldBack(contract, trace, audience) {
  if (audience === "internal") return [];
  const rank = { public: 0, partner: 1, internal: 2 };
  const out = [];
  for (const f of trace.firings ?? []) {
    const rule = contract.rules?.[f.rule];
    if (!rule) continue;
    if (rank[rule.audience ?? "internal"] > rank[audience]) {
      out.push({ rule: f.rule, what: `the whole <code>${rule.reason_code}</code> reason`,
                 needs: rule.audience ?? "internal", why: "the reason itself is above this tier" });
      continue;
    }
    for (const [engine, spec] of Object.entries(rule.facts ?? {})) {
      if (!(engine in (f.facts ?? {}))) continue;
      if (rank[spec.audience ?? "internal"] > rank[audience]) {
        out.push({ rule: f.rule,
                   what: `<code>${spec.as}</code> = <code>${f.facts[engine]}</code>`,
                   needs: spec.audience ?? "internal",
                   why: `the engine calls this <code>${engine}</code>` });
      }
    }
  }
  if (trace.ruleset) out.push({ rule: "—", what: `<code>ruleset</code> = <code>${trace.ruleset}</code>`, needs: "internal", why: "engine identity" });
  if (trace.version) out.push({ rule: "—", what: `<code>version</code> = <code>${trace.version}</code>`, needs: "internal", why: "ruleset version" });
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
