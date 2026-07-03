import path from "node:path";
import type { NextConfig } from "next";

/** Conservative security headers (CSP is intentionally omitted — inline
 *  styles from the animation libraries would need nonces; add one per-deploy
 *  if your platform supports it). */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Pin tracing to this app so a stray lockfile higher up doesn't confuse it.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Our local renders are large; ship modern formats and a couple of
    // quality steps for the cinematic full-bleed imagery.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 90],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
