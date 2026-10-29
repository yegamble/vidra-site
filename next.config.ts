import type { NextConfig } from "next";

/**
 * The docs are a separate build. They are served under /docs on this origin so
 * that the marketing site and the documentation share one hostname and one
 * cookie scope. Point DOCS_ORIGIN at a preview deployment to work against it.
 */
const DOCS_ORIGIN = process.env.DOCS_ORIGIN ?? "https://vidra-docs.pages.dev";

const nextConfig: NextConfig = {
  // Retired marketing URLs keep working without preserving the old pages.
  async redirects() {
    return ["/get-started", "/features", "/use-cases", "/compare/peertube", "/scale", "/ipfs", "/demo"].map((source) => ({
      source, destination: "/", permanent: true,
    }));
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
