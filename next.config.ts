import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://eyesic36-001-site1.ftempurl.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
