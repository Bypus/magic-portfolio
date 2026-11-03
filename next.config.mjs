import mdx from "@next/mdx";
import { securityHeaders } from "./security-headers.mjs";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders(process.env.NODE_ENV === "development") },
      { source: "/magical-mirai-2026/:path*", headers: securityHeaders(process.env.NODE_ENV === "development", true) },
      {
        source: "/api/:path*",
        headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; frame-ancestors 'none'; sandbox" }],
      },
      {
        source: "/api/:endpoint(authenticate|check-auth)",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
