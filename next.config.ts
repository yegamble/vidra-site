import type { NextConfig } from "next";

/**
 * The docs are a separate build. They are served under /docs on this origin so
 * that the marketing site and the documentation share one hostname and one
 * cookie scope. Point DOCS_ORIGIN at a preview deployment to work against it.
 */
const DOCS_ORIGIN = process.env.DOCS_ORIGIN ?? "https://vidra-docs.pages.dev";

const nextConfig: NextConfig = {
  /**
   * The install flow used to be a page. It is now the `#get-started` section of
   * the homepage, where the reader already is when they decide to install —
   * so the old URL becomes a permanent redirect rather than a dead link in
   * somebody's notes. 308, because a 302 would keep the old URL alive forever.
   */
  async redirects() {
    return [
      { source: "/get-started", destination: "/#get-started", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Bare /docs, so the nav link resolves without a trailing segment.
      { source: "/docs", destination: `${DOCS_ORIGIN}/docs` },
      { source: "/docs/:path*", destination: `${DOCS_ORIGIN}/docs/:path*` },
    ];
  },
};

export default nextConfig;
