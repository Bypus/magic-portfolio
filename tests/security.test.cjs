const assert = require("node:assert/strict");
const { test } = require("node:test");
const { NextRequest } = require("next/server");
const { loadTS } = require("./load-ts.cjs");
const access = loadTS("src/utils/pageAccess.ts");
const { RateLimiter, clientKey } = loadTS("src/utils/rateLimit.ts");
const { guardApiRequest, readSmallJson } = loadTS("src/utils/apiSecurity.ts");
const { POST } = loadTS("src/app/api/authenticate/route.ts");
const { GET } = loadTS("src/app/api/check-auth/route.ts");

test("access tokens reject forgery, expiry, password rotation and disabled access", (t) => {
  const oldPassword = process.env.PAGE_ACCESS_PASSWORD;
  const oldSecret = process.env.PAGE_ACCESS_SECRET;
  t.after(() => {
    if (oldPassword === undefined) delete process.env.PAGE_ACCESS_PASSWORD;
    else process.env.PAGE_ACCESS_PASSWORD = oldPassword;
    if (oldSecret === undefined) delete process.env.PAGE_ACCESS_SECRET;
    else process.env.PAGE_ACCESS_SECRET = oldSecret;
  });
  process.env.PAGE_ACCESS_PASSWORD = "test-password-for-access-only";
  process.env.PAGE_ACCESS_SECRET = "test-signing-key";
  const now = 1_800_000_000_000;
  const token = access.createAccessToken(now);
  assert.ok(access.isValidAccessToken(token, now));
  assert.equal(access.isValidAccessToken("authenticated", now), false);
  assert.equal(access.isValidAccessToken(token + "x", now), false);
  assert.equal(access.isValidAccessToken(token, now + 3_600_000), false);
  assert.equal(access.isValidAccessToken(token, now - 3_600_000), false);
  process.env.PAGE_ACCESS_PASSWORD = "rotated-test-password";
  assert.equal(access.isValidAccessToken(token, now), false);
  delete process.env.PAGE_ACCESS_PASSWORD;
  assert.equal(access.isValidAccessToken(token, now), false);
});

test("rate limiter bounds client cardinality without evicting active attempts", () => {
  const limiter = new RateLimiter(2, 10_000, 2);
  assert.equal(limiter.take("a", 0), 0);
  assert.equal(limiter.take("a", 0), 0);
  assert.equal(limiter.take("a", 0), 10);
  assert.equal(limiter.take("b", 0), 0);
  assert.equal(limiter.take("c", 0), 10);
  assert.equal(limiter.take("a", 1000), 9);
  assert.equal(limiter.take("c", 10_000), 0);
});

test("untrusted forwarding headers do not create new local rate-limit buckets", (t) => {
  const old = process.env.VERCEL;
  delete process.env.VERCEL;
  t.after(() => { if (old === undefined) delete process.env.VERCEL; else process.env.VERCEL = old; });
  assert.equal(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4" })), "local");
  process.env.VERCEL = "1";
  assert.equal(clientKey(new Headers({ "x-vercel-forwarded-for": "1.2.3.4", "x-forwarded-for": "5.6.7.8" })), "1.2.3.4");
});

test("API guard rejects cross-site requests and overlong URLs", () => {
  const url = "https://portfolio.test/api/authenticate";
  assert.equal(guardApiRequest(new Request(url, { headers: { Origin: "https://evil.test" } })).status, 403);
  assert.equal(guardApiRequest(new Request(url, { headers: { "sec-fetch-site": "cross-site" } })).status, 403);
  assert.equal(guardApiRequest(new Request(url, { headers: { Origin: "https://portfolio.test" } })), null);
  assert.equal(guardApiRequest(new Request("https://internal.test/api/authenticate", {
    headers: { Host: "portfolio.test", Origin: "https://portfolio.test" },
  })), null);
  assert.equal(guardApiRequest(new Request(url, { headers: { Origin: "https://social.test" } }), undefined, false), null);
  assert.equal(guardApiRequest(new Request(url + "?q=" + "a".repeat(8192))).status, 414);
});

test("JSON bodies are bounded even without Content-Length and cannot stall indefinitely", async () => {
  const request = (body, headers = {}) => new Request("https://portfolio.test", {
    method: "POST", body, duplex: "half", headers: { "Content-Type": "application/json", ...headers },
  });
  assert.deepEqual(await readSmallJson(request('{"password":"ok"}')), { password: "ok" });
  await assert.rejects(readSmallJson(request("{}", { "Content-Length": "5000" })), { status: 413 });
  await assert.rejects(readSmallJson(request(" ".repeat(4097))), { status: 413 });
  await assert.rejects(readSmallJson(request("not-json")), { status: 400 });
  await assert.rejects(readSmallJson(request("{}", { "Content-Type": "text/plain" })), { status: 415 });
  await assert.rejects(readSmallJson(request(new ReadableStream({ start() {} })), 4096, 20), { status: 408 });
});

test("authentication responses never cache and only valid signed cookies grant access", async (t) => {
  const previous = process.env.PAGE_ACCESS_PASSWORD;
  process.env.PAGE_ACCESS_PASSWORD = "test-password-for-access-only";
  t.after(() => { if (previous === undefined) delete process.env.PAGE_ACCESS_PASSWORD; else process.env.PAGE_ACCESS_PASSWORD = previous; });
  const login = (body) => POST(new NextRequest("https://portfolio.test/api/authenticate", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  const wrong = await login({ password: "wrong" });
  assert.equal(wrong.status, 401);
  assert.match(wrong.headers.get("cache-control"), /no-store/);
  const success = await login({ password: process.env.PAGE_ACCESS_PASSWORD });
  assert.equal(success.status, 200);
  assert.match(success.headers.get("set-cookie"), /HttpOnly/);
  assert.match(success.headers.get("set-cookie"), /SameSite=Strict/);
  const cookie = success.headers.get("set-cookie").split(";")[0];
  const valid = await GET(new NextRequest("https://portfolio.test/api/check-auth", { headers: { Cookie: cookie } }));
  assert.equal(valid.status, 200);
  assert.match(valid.headers.get("cache-control"), /no-store/);
  const forged = await GET(new NextRequest("https://portfolio.test/api/check-auth", { headers: { Cookie: "authToken=authenticated" } }));
  assert.equal(forged.status, 401);
  assert.match(forged.headers.get("cache-control"), /no-store/);
});
