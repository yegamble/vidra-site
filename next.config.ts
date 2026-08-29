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
      // The proxy strips the /docs prefix: the docs build's baseUrl is
      // /docs/ (so every URL it *generates* carries the prefix and routes
      // back through this origin), but the emitted files sit at the docs
      // origin's root — Docusaurus writes content relative to the output
      // dir, not the baseUrl. Forwarding the prefix upstream was the bug
      // that 404ed the entire seam.
      { source: "/docs", destination: `${DOCS_ORIGIN}/` },
      { source: "/docs/:path*", destination: `${DOCS_ORIGIN}/:path*` },
    ];
  },
};

export default nextConfig;
