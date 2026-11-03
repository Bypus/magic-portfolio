import type { Metadata } from "next";

// Next can replace a proxy's Cache-Control with the target's static cache
// policy. Never prerender/cache the password form reached by a rewrite.
export const dynamic = "force-dynamic";

// What src/proxy.ts renders in place of a protected page for a visitor
// without access. It has no content of its own: RouteGuard shows the
// password form, then refreshes so the real page is rendered.
export const metadata: Metadata = {
  title: "Password protected",
  robots: { index: false, follow: false },
};

export default function Locked() {
  return null;
}
