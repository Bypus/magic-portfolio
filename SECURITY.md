# Security maintenance

Before deployment, run `npm test`, `npm run typecheck`, `npm audit` and
`npm run build`. CI checks dependencies and security regressions on pull requests.
Keep `package-lock.json` committed. Do not use `npm audit fix --force` or remove
the KaTeX overrides without checking the math plugins together.

## Protected pages

Set a strong, unique `PAGE_ACCESS_PASSWORD` in Vercel and in an ignored
`.env.local` for development. A random `PAGE_ACCESS_SECRET` is recommended.
Changing either value signs existing visitors out. Authentication responses
and protected pages must remain `private, no-store`.

The public repository, its history, and `public/` assets are public regardless
of page passwords. Never put confidential material there. Protected project
and blog pages check access on the server; their metadata is withheld from
unauthenticated requests and their URLs are excluded from the sitemap and RSS.

## Network and browser protections

Open Graph fetch/proxy routes use Once UI's public-address validation, DNS
pinning, redirect validation, response-size limits and deadlines. Keep those
handlers when updating upstream. Their caller checks are not authentication:
requests without browser origin headers can still be made by scripts.

Rate limits are bounded **per server instance**. Vercel instances do not share
their counters. Configure Vercel Firewall rate limits for `/api/authenticate`
and `/api/og/*` for a deployment-wide quota; this cannot be guaranteed by an
in-memory map. Outside Vercel, callers share one bucket unless a trusted proxy
integration is added. Do not trust arbitrary forwarded IP headers.

The CSP preserves static Next.js pages, which require inline bootstrap scripts.
It allows inline scripts and styles, but disallows production `eval`, script
attributes, object embeds and framing by other sites. It is not a nonce-based
strict CSP. Only the mini-game allows scripts from unpkg; its classic scripts
have pinned versions and SRI. Preserve its CDN integrity hashes when upgrading.

## Local integration check

Build first. In a separate terminal, set the test-only credentials for that
process and start the server on loopback:

```powershell
$env:PAGE_ACCESS_PASSWORD = 'local-security-test-only-password'
$env:PAGE_ACCESS_SECRET = 'local-security-test-only-signing-key'
npm start -- --hostname 127.0.0.1 --port 3107
```

Then run `node tests/smoke-security.mjs`. Never use these test credentials in
Vercel. Close that test terminal afterward so its environment is discarded.
