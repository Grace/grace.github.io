import { project } from "./project.js";

const CONTRACT = {
  "contract_version": "1",
  "ruleset": "shipping-eligibility",
  "outcomes": {
    "ALLOW": {
      "as": "eligible",
      "audience": "public"
    },
    "DENY": {
      "as": "not_eligible",
      "audience": "public"
    },
    "HOLD": {
      "as": "under_review",
      "audience": "partner"
    }
  },
  "rules": {
    "RL_DEST_OUTSIDE_ZONE": {
      "audience": "public",
      "reason_code": "DESTINATION_NOT_SERVED",
      "message": "We do not ship to this destination yet. Served zones: {served_zones}.",
      "facts": {
        "SupportedZones": {
          "as": "served_zones",
          "audience": "public"
        },
        "DestZoneCode": {
          "as": "zone",
          "audience": "internal"
        }
      }
    },
    "RL_PKG_MASS_OVER_LIMIT": {
      "audience": "public",
      "reason_code": "PACKAGE_TOO_HEAVY",
      "message": "This package is {mass} kg; the limit is {limit} kg.",
      "facts": {
        "PkgMassKg": {
          "as": "mass",
          "audience": "public"
        },
        "MaxMassKg": {
          "as": "limit",
          "audience": "public"
        }
      }
    },
    "RL_CARRIER_MARGIN_FLOOR": {
      "audience": "internal",
      "reason_code": "BELOW_MARGIN_FLOOR",
      "message": "Margin {margin} bps is under the {floor} bps floor.",
      "facts": {
        "MarginBps": {
          "as": "margin",
          "audience": "internal"
        },
        "FloorBps": {
          "as": "floor",
          "audience": "internal"
        }
      }
    }
  }
};
const BASE_TRACE = {
  "ruleset": "shipping-eligibility",
  "version": "2026.09.1",
  "outcome": "DENY",
  "firings": [
    {
      "rule": "RL_DEST_OUTSIDE_ZONE",
      "facts": {
        "DestZoneCode": "Z9",
        "SupportedZones": "Z1-Z4"
      }
    },
    {
      "rule": "RL_PKG_MASS_OVER_LIMIT",
      "facts": {
        "PkgMassKg": 34.5,
        "MaxMassKg": 30
      }
    },
    {
      "rule": "RL_CARRIER_MARGIN_FLOOR",
      "facts": {
        "MarginBps": 40,
        "FloorBps": 150
      }
    }
  ]
};
const UNMAPPED = { rule: "RL_SANCTIONS_HIT", facts: { ListId: "OFAC-SDN", MatchScore: 0.94 } };

const HINTS = {
  public:   "a customer, or anyone who can submit a transaction",
  partner:  "a carrier or integrator under contract",
  internal: "your own operators and support staff",
  __unmapped: "a new rule ships before the contract does",
};
const WHO = {
  public: "— to a public caller", partner: "— to a partner",
  internal: "— to an internal caller", __unmapped: "— to a public caller",
};

const $trace = document.getElementById("trace");
const $out = document.getElementById("out");
const $rows = document.getElementById("rows");
const $none = document.getElementById("none");
const $hint = document.getElementById("hint");
const $who = document.getElementById("who");
const buttons = [...document.querySelectorAll(".tiers button")];

let mode = "public";

function traceFor(mode) {
  const t = structuredClone(BASE_TRACE);
  if (mode === "__unmapped") t.firings.push(structuredClone(UNMAPPED));
  return t;
}

function render() {
  const audience = mode === "__unmapped" ? "public" : mode;
  let trace;
  try {
    trace = JSON.parse($trace.value);
  } catch (e) {
    $out.className = "box refused";
    $out.textContent = "the trace is not valid JSON:\n\n" + e.message;
    $rows.innerHTML = ""; $none.hidden = true;
    return;
  }

  const r = project(CONTRACT, trace, audience);
  $hint.textContent = HINTS[mode];
  $who.textContent = WHO[mode];

  if (!r.ok) {
    // Deny by default: a decision published with a reason missing states a
    // conclusion whose causes are not the real ones.
    $out.className = "box refused";
    $out.textContent = "refused to publish\n\n" + r.error;
    $rows.innerHTML = "";
    $none.hidden = true;
    return;
  }

  $out.className = "box";
  $out.textContent = JSON.stringify(r.projection, null, 2);

  const rows = r.withheld.map((w) => {
    const what = w.kind === "reason"
      ? `the whole <code>${w.code}</code> reason`
      : w.kind === "meta"
        ? `<code>${w.as}</code> = <code>${w.value}</code>`
        : `<code>${w.engineName}</code> → <code>${w.as}</code> = <code>${w.value}</code>`;
    return `<tr>
      <td class="mono">${w.rule ?? "—"}</td>
      <td>${what}</td>
      <td><span class="tag t-${w.needs}">${w.needs}</span></td>
      <td>${w.why}</td>
    </tr>`;
  });
  $rows.innerHTML = rows.join("");
  $none.hidden = rows.length > 0;
}

buttons.forEach((b) => b.addEventListener("click", () => {
  mode = b.dataset.a;
  buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  $trace.value = JSON.stringify(traceFor(mode), null, 2);
  render();
}));
$trace.addEventListener("input", render);

$trace.value = JSON.stringify(BASE_TRACE, null, 2);
render();
