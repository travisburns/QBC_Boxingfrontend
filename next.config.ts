import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy API calls through the frontend origin. The browser calls
  // same-origin `/api/*` (HTTPS on qbcboxing.com), and Vercel forwards to the
  // backend server-side over HTTP — so there's no CORS, no mixed content, and
  // the backend needs no working SSL certificate of its own.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://eyesic36-001-site1.ftempurl.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
