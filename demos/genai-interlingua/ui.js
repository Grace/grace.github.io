// Drives the genai-interlingua WASM demo.
//
// Everything interesting happens in Go. This file's only job is to decide what
// is worth showing, and the answer is not the output blob: it is which keys
// arrived that were not there before, and what the span now says it could not
// carry.

const $in = document.getElementById("in");
const $out = document.getElementById("out");
const $target = document.getElementById("target");
const $strip = document.getElementById("strip");
const $status = document.getElementById("status");
const $verdict = document.getElementById("verdict");
const $facts = document.getElementById("facts");
const $samples = document.getElementById("samples");

let ready = false;
let current = null;

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Every attribute key on every span, so the two sides can be compared. The
// demo shows one payload at a time, so flattening across spans is honest here.
function keysOf(doc) {
  const out = new Set();
  for (const rs of doc.resourceSpans ?? []) {
    for (const ss of rs.scopeSpans ?? []) {
      for (const span of ss.spans ?? []) {
        for (const kv of span.attributes ?? []) out.add(kv.key);
      }
    }
  }
  return out;
}

// Pull a single attribute's value out, whichever of the OTLP union members it
// used. Only the shapes this normalizer emits are handled.
function attr(doc, key) {
  for (const rs of doc.resourceSpans ?? []) {
    for (const ss of rs.scopeSpans ?? []) {
      for (const span of ss.spans ?? []) {
        for (const kv of span.attributes ?? []) {
          if (kv.key !== key) continue;
          const v = kv.value ?? {};
          if (v.stringValue !== undefined) return v.stringValue;
          if (v.intValue !== undefined) return v.intValue;
          if (v.boolValue !== undefined) return String(v.boolValue);
          if (v.arrayValue !== undefined) {
            return (v.arrayValue.values ?? []).map((x) => x.stringValue).filter(Boolean);
          }
        }
      }
    }
  }
  return undefined;
}

function render() {
  if (!ready) { $status.textContent = "loading…"; return; }
  $status.textContent = "";

  const text = $in.value;
  if (!text.trim()) { $out.textContent = ""; $verdict.textContent = ""; $facts.innerHTML = ""; return; }

  const r = interlinguaNormalize(text, $target.value, $strip.checked);
  if (!r.ok) {
    $out.innerHTML = `<span class="err">${esc(r.error)}</span>`;
    $verdict.textContent = "";
    $facts.innerHTML = "";
    return;
  }

  let before, after;
  try {
    before = JSON.parse(text);
    after = JSON.parse(r.out);
  } catch (e) {
    $out.textContent = r.out;
    return;
  }

  const had = keysOf(before);
  const has = keysOf(after);
  const added = [...has].filter((k) => !had.has(k)).sort();

  // Colour the added keys in the output so the change is visible without
  // diffing two panes by eye.
  $out.innerHTML = esc(r.out).replace(/"([\w.]+)":/g, (m, key) =>
    added.includes(key) ? `"<span class="added">${esc(key)}</span>":` : m);

  const dialect = attr(after, "interlingua.dialect");
  const confidence = attr(after, "interlingua.dialect.confidence");
  const lossy = attr(after, "interlingua.lossy");
  const lossCount = attr(after, "interlingua.lossy.count");

  if (dialect === undefined) {
    $verdict.textContent = "No dialect claimed this span — it is returned exactly as it arrived.";
    $facts.innerHTML = "<tr><td class='k'>why</td><td>Nothing on it looks like GenAI telemetry. " +
      "In a pipeline most spans are HTTP or database calls, and stamping them all would be worse " +
      "than recognizing nothing.</td></tr>";
    return;
  }

  const gained = added.filter((k) => k.startsWith("gen_ai.")).length;
  $verdict.innerHTML = `Recognized as <strong>${esc(dialect)}</strong>` +
    ` — ${gained} <span class="added">gen_ai.*</span> ${gained === 1 ? "attribute" : "attributes"} added` +
    (Number(lossCount) > 0 ? `, <span class="lost">${esc(lossCount)}</span> not carried` : ", nothing lost");

  const rows = [];
  rows.push(["detection confidence", `${esc(confidence)} — the winner's margin over the runner-up. ` +
    (Number(confidence) === 0 ? "Zero means it was a tie, or the fallback." : "")]);
  rows.push(["target", `<code>${esc(attr(after, "interlingua.target"))}</code> — recorded on the span, ` +
    "because these conventions have no released version and so no schema URL to carry it"]);
  if (Array.isArray(lossy) && lossy.length) {
    rows.push(["not a faithful carrier of",
      lossy.map((k) => `<code class="lost">${esc(k)}</code>`).join("<br>")]);
  }
  $facts.innerHTML = rows.map(([k, v]) => `<tr><td class="k">${k}</td><td>${v}</td></tr>`).join("");
}

function selectSample(name) {
  current = name;
  $in.value = JSON.stringify(SAMPLES[name].payload, null, 2);
  for (const b of $samples.children) b.setAttribute("aria-pressed", String(b.dataset.name === name));
  render();
}

for (const [name, s] of Object.entries(SAMPLES)) {
  const b = document.createElement("button");
  b.className = "sample";
  b.textContent = s.label;
  b.dataset.name = name;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => selectSample(name));
  $samples.appendChild(b);
}

$in.addEventListener("input", () => { render(); });
$target.addEventListener("change", render);
$strip.addEventListener("change", render);

const go = new Go();
WebAssembly.instantiateStreaming(fetch("./genai-interlingua.wasm"), go.importObject)
  .then((res) => {
    go.run(res.instance);
    ready = true;

    // The selector is built from the Go enum so the page cannot offer a target
    // the normalizer does not implement.
    const t = interlinguaTargets();
    for (const name of t.targets) {
      const o = document.createElement("option");
      o.value = o.textContent = name;
      if (name === t.default) o.selected = true;
      $target.appendChild(o);
    }
    selectSample(Object.keys(SAMPLES)[0]);
  })
  .catch((e) => { $status.innerHTML = `<span class="err">could not load: ${esc(e.message)}</span>`; });
