// Pins the JS port against the Go binary. Run: node verify.mjs
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { project } from "./project.js";

const contract = JSON.parse(readFileSync("contract.json", "utf8"));
const trace = JSON.parse(readFileSync("trace.json", "utf8"));
let failures = 0;

for (const audience of ["public", "partner", "internal"]) {
  const want = JSON.parse(execFileSync("/tmp/warden",
    ["project", "-contract", "contract.json", "-trace", "trace.json", "-audience", audience],
    { encoding: "utf8" }));
  const got = project(contract, trace, audience).projection;
  const same = JSON.stringify(want) === JSON.stringify(got);
  if (!same) {
    failures++;
    console.log(`  ${audience}: MISMATCH`);
    console.log("    go:", JSON.stringify(want));
    console.log("    js:", JSON.stringify(got));
  } else {
    console.log(`  ${audience}: matches the Go binary`);
  }
}

// Deny-by-default
const withUnknown = structuredClone(trace);
withUnknown.firings.push({ rule: "RL_SANCTIONS_HIT", facts: { ListId: "OFAC-SDN" } });
const r = project(contract, withUnknown, "public");
console.log(r.ok === false && /not in the contract/.test(r.error)
  ? "  unmapped rule: refuses, as the Go does"
  : (failures++, "  unmapped rule: DID NOT REFUSE"));

process.exit(failures ? 1 : 0);
