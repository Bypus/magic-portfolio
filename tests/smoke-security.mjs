// Run manually against a production build started with the test-only password:
// PAGE_ACCESS_PASSWORD=local-security-test-only-password npm start -- -p 3107
import assert from "node:assert/strict";

const base = "http://127.0.0.1:3107";
for (const path of ["/", "/about", "/work", "/gallery", "/room", "/open-app", "/magical-mirai-2026/index.html"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.ok(response.headers.get("content-security-policy").includes("object-src 'none'"));
  assert.equal(response.headers.get("x-powered-by"), null);
  console.log(path, response.status, "security headers OK");
}

const forged = await fetch(base + "/api/check-auth", { headers: { Cookie: "authToken=authenticated" } });
assert.equal(forged.status, 401);
assert.match(forged.headers.get("cache-control"), /no-store/);
const login = await fetch(base + "/api/authenticate", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: base },
  body: JSON.stringify({ password: "local-security-test-only-password" }),
});
assert.equal(login.status, 200);
assert.match(login.headers.get("cache-control"), /no-store/);
assert.match(login.headers.get("set-cookie"), /HttpOnly/);
assert.match(login.headers.get("set-cookie"), /Secure/);
const authenticated = await fetch(base + "/api/check-auth", {
  headers: { Cookie: login.headers.get("set-cookie").split(";")[0] },
});
assert.equal(authenticated.status, 200);
console.log("Signed authentication succeeds; forged cookie rejected; responses never cached");

const oversized = await fetch(base + "/api/authenticate", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: " ".repeat(4097),
});
assert.equal(oversized.status, 413);

for (const route of ["fetch", "proxy"]) {
  for (const url of ["http://127.0.0.1", "http://localhost.", "http://[::ffff:127.0.0.1]"]) {
    const response = await fetch(base + `/api/og/${route}?url=` + encodeURIComponent(url));
    assert.equal(response.status, 400, `${route}: ${url}`);
  }
  const crossSite = await fetch(base + `/api/og/${route}?url=https://example.com`, { headers: { Origin: "https://evil.test" } });
  assert.equal(crossSite.status, 403);
  console.log(route, "private targets and cross-site requests rejected");
}
const htmlProxy = await fetch(base + "/api/og/proxy?url=https://example.com");
assert.equal(htmlProxy.status, 415);
assert.match(htmlProxy.headers.get("content-security-policy"), /sandbox/);
console.log("Image proxy refuses external HTML");

const title = await fetch(base + "/api/og/generate?title=" + "a".repeat(201));
assert.equal(title.status, 400);
const protectedPage = await fetch(base + "/work/automate-design-handovers-with-a-figma-to-code-pipeline");
assert.match(protectedPage.headers.get("cache-control"), /no-store/);
assert.match(await protectedPage.text(), /<title>Password protected<\/title>/);
console.log("Protected page renders the locked response with no-store");
const protectedRsc = await fetch(base + "/work/automate-design-handovers-with-a-figma-to-code-pipeline", {
  headers: { RSC: "1" },
});
assert.match(protectedRsc.headers.get("cache-control"), /no-store/);
console.log("Protected RSC response is also not cached");

const game = await (await fetch(base + "/magical-mirai-2026/index.html")).text();
assert.equal((game.match(/integrity="sha384-/g) || []).length, 2);
assert.ok(!game.includes("https://unpkg.com/axios/dist"));
console.log("Mini-game scripts have pinned versions and SRI");
