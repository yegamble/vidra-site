import type { NextConfig } from "next";

/**
 * The docs are a separate build. They are served under /docs on this origin so
 * that the marketing site and the documentation share one hostname and one
 * cookie scope. Point DOCS_ORIGIN at a preview deployment to work against it.
 */
const DOCS_ORIGIN = process.env.DOCS_ORIGIN ?? "https://vidra-docs.pages.dev";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Bare /docs, so the nav link resolves without a trailing segment.
      { source: "/docs", destination: `${DOCS_ORIGIN}/docs` },
      { source: "/docs/:path*", destination: `${DOCS_ORIGIN}/docs/:path*` },
    ];
  },
};

export default nextConfig;
