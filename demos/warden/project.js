// A JavaScript port of warden's projection, for the browser demo.
// Behaviour is pinned against the Go binary's output in verify.mjs.

const TIER = { public: 0, partner: 1, internal: 2 };
const visible = (declared, audience) => TIER[declared ?? "internal"] <= TIER[audience];

// Facts stringify on the way out: a projection is a published contract, and
// "30" and 30 are different things to a consumer parsing it.
const str = (v) =>
  typeof v === "number" ? String(v) : typeof v === "string" ? v : JSON.stringify(v);

function interpolate(template, facts) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in facts ? facts[k] : m));
}

/**
 * Returns { ok, projection, withheld, error }.
 * withheld is the point of the demo: what the engine said that did not cross.
 */
export function project(contract, trace, audience) {
  const withheld = [];

  const outcome = contract.outcomes?.[trace.outcome];
  if (!outcome) {
    return { ok: false, error: `outcome "${trace.outcome}" is not in the contract` };
  }

  const reasons = [];
  for (const firing of trace.firings ?? []) {
    const rule = contract.rules?.[firing.rule];

    // Deny by default. A rule that fired but is not mapped stops the whole
    // projection -- publishing a decision with a reason missing states a
    // conclusion whose causes are not the real ones.
    if (!rule) {
      return {
        ok: false,
        error: `rule "${firing.rule}" fired but is not in the contract; ` +
               `refusing to publish a decision whose reasons are incomplete`,
      };
    }

    if (!visible(rule.audience, audience)) {
      withheld.push({
        kind: "reason", rule: firing.rule, code: rule.reason_code,
        needs: rule.audience,
        why: `the whole reason is ${rule.audience}-only`,
      });
      continue;
    }

    const facts = {};
    for (const [engineName, spec] of Object.entries(rule.facts ?? {})) {
      if (!(engineName in (firing.facts ?? {}))) continue;
      const value = str(firing.facts[engineName]);
      if (visible(spec.audience, audience)) {
        facts[spec.as] = value;
      } else {
        withheld.push({
          kind: "fact", rule: firing.rule, engineName, as: spec.as,
          value, needs: spec.audience,
          why: `fact is ${spec.audience}-only`,
        });
      }
    }

    reasons.push({
      code: rule.reason_code,
      message: interpolate(rule.message ?? "", facts),
      // Go's encoding/json emits map keys sorted; match it so the demo's
      // output is byte-identical to the binary's.
      facts: Object.fromEntries(Object.keys(facts).sort().map((k) => [k, facts[k]])),
    });
  }

  const projection = {
    contract_version: contract.contract_version,
    outcome: outcome.as,
    reasons,
  };
  // Ruleset identity and version are engine internals; only internal sees them.
  if (TIER[audience] >= TIER.internal) {
    projection.ruleset = trace.ruleset;
    projection.version = trace.version;
  } else {
    if (trace.ruleset) withheld.push({ kind: "meta", as: "ruleset", value: trace.ruleset, needs: "internal", why: "engine identity" });
    if (trace.version) withheld.push({ kind: "meta", as: "version", value: trace.version, needs: "internal", why: "ruleset version" });
  }

  return { ok: true, projection, withheld };
}
