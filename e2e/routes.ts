/** The launch page is the only marketing route. Docs are an upstream rewrite. */
export const ROUTES = ["/"] as const;
export const RETIRED_ROUTES = ["/get-started", "/features", "/use-cases", "/compare/peertube", "/scale", "/ipfs", "/demo"] as const;

/**
 * The widths the site has to survive. Phone, tablet portrait, tablet
 * landscape, laptop — the last one is the width everything gets designed at,
 * which is exactly why it is not the only one here.
 */
export const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
] as const;

export const PHONE = VIEWPORTS[0];
export const LAPTOP = VIEWPORTS[3];
