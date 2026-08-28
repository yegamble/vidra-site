import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// All routes are statically prerendered; no ISR/KV cache is needed.
export default defineCloudflareConfig();
