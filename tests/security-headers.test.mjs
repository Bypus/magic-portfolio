import assert from "node:assert/strict";
import { test } from "node:test";
import { securityHeaders } from "../security-headers.mjs";

test("production CSP blocks objects, external framing, script attributes and eval", () => {
  const headers = Object.fromEntries(securityHeaders().map(({ key, value }) => [key, value]));
  const csp = headers["Content-Security-Policy"];
  for (const directive of ["object-src 'none'", "base-uri 'none'", "frame-ancestors 'self'", "script-src-attr 'none'"]) {
    assert.ok(csp.includes(directive));
  }
  assert.ok(!csp.includes("unsafe-eval"));
  assert.ok(!csp.includes("unpkg.com"));
  assert.ok(csp.includes("steam:"));
  assert.ok(csp.includes("com.epicgames.launcher:"));
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "SAMEORIGIN");
  assert.ok(securityHeaders(false, true).find((header) => header.key === "Content-Security-Policy").value.includes("https://unpkg.com"));
});
