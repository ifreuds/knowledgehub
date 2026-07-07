# PoE Codex

A private, personal **Path of Exile 1 & 2** knowledge hub — a freeze-per-league archive of what I learn each league, plus interactive tools.

- **Stack:** static [Astro](https://astro.build) shell + self-contained *frozen* HTML content bodies, hosted on **Cloudflare Workers** (static assets + a D1-backed logging API).
- **Conventions:** see **[CLAUDE.md](./CLAUDE.md)** — read it before adding or changing content.
- **Content:** `public/content/<game>/<slug>/{meta.json, <league>.html}` — each version is a frozen league snapshot.
- **Deploy:** Workers Builds → `npm run build` → `npx wrangler deploy` (auto on push to `main`).
- **Logging tools:** `POST/GET /api/log` (`worker/index.js`) backed by D1 `poe-hub`.
