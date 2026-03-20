import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/iconlogo-app/:path*",
        destination: "http://127.0.0.1:5173/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/background-remover",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
      {
        source: "/background-remover/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
