import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const devTarget = "http://localhost:5173";
    const prodTarget = process.env.ICONLOGO_PROXY_TARGET;
    const target = process.env.NODE_ENV === "development" ? devTarget : prodTarget;

    if (!target) {
      return {
        beforeFiles: [],
      };
    }

    const normalizedTarget = target.replace(/\/$/, "");

    return {
      beforeFiles: [
        {
          source: "/iconlogo",
          destination: `${normalizedTarget}/iconlogo/`,
        },
        {
          source: "/iconlogo/:path*",
          destination: `${normalizedTarget}/iconlogo/:path*`,
        },
      ],
    };
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
