import { defineConfig } from 'astro/config';

// Static output. Cloudflare Pages picks up /functions automatically.
// Frozen content bodies live in public/content/** and are served as-is for the iframe.
export default defineConfig({
  redirects: {
    '/': '/poe2',
  },
});
