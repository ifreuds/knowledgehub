# CLAUDE.md — PoE Knowledge Hub

Governance + conventions for this project. **Any AI or MCP working in this repo MUST follow this file.** `AGENTS.md` is a pointer to it.

## What this is
A private, online **Path of Exile 1 & 2** personal knowledge hub — a *freeze-everything* archive of what the owner learns each league, plus some interactive/logging tools. Read-mostly, shared by private link. The owner authors by asking an AI (me) to add/update pages; changes ship via `git push` → Cloudflare Pages.

## Non-negotiable architecture
1. **Content-as-code.** No CMS, no runtime database for *content*. Content lives as files in git.
2. **Two games, separate trees:** `content/poe2/…` and `content/poe1/…`. Never mix.
3. **Living shell + frozen bodies.**
   - The **shell** (Astro) renders only hub chrome: nav, theme, game toggle, league banner, review queue, search. Restyle it freely, anytime.
   - A **content page** is a **self-contained HTML body** embedded in the shell via `<iframe>`. The shell must never re-render or restyle a frozen body.
4. **Freeze everything, per league version** — text, images, icons, layout, AND interactive tool code. A saved version is immutable.
5. **Hosting:** Cloudflare Pages. **Source:** GitHub. **Logging persistence:** Cloudflare D1 + Pages Functions. No Supabase.

## Content page layout
```
public/content/<game>/<slug>/     # under public/ so frozen bodies are served as static assets the iframe can load
  meta.json
  0.5.html        # a league snapshot: self-contained (inline CSS+JS, assets as files or data: URIs)
  0.4.html        # older frozen version, immutable
```
- **A version = a league snapshot.** Filename = league number (`0.5.html`).
- **Update for a new league:** copy the latest `*.html` to `<newleague>.html`, edit the copy, add a `versions[]` entry, set it current. **Never edit an existing version file to change its content.** Git is the final backup.
- **Interactive tools freeze with the page** — their JS is inline in that version's HTML. Never extract shared/global tool components across versions (that would silently un-freeze old pages).

## meta.json
```json
{
  "title": "Waystone Sustain",
  "slug": "waystone-sustain",
  "game": "poe2",
  "tags": ["endgame", "mechanics"],
  "summary": "one-line description shown on the hub card (optional)",
  "image": "/content/poe2/<slug>/thumb.webp — optional card art (optional)",
  "type": "article",
  "interactive": false,
  "currentVersion": "0.5",
  "updatedForLeague": "0.5",
  "versions": [
    { "league": "0.5", "leagueName": "Rune of Aldurs", "patch": "0.5.4b",
      "file": "0.5.html", "updated": "2026-07-07", "changelog": "Initial." }
  ]
}
```
`type`: `"article" | "tool"`. `interactive`: `true` = writes to D1 via `/api`.

## League + status system
- Per-game **current league** lives in `src/config` (e.g. `poe2 = { league: "0.5", name: "Rune of Aldurs", patch: "0.5.4b" }`).
- **Status is computed, never stored:** 🟢 up-to-date if `updatedForLeague === currentLeague.league`, else 🟡 needs-review (show the page's last league).
- **Granularity = league (`0.5`), not patch.** Patch (`0.5.4b`) is per-version metadata only, so hotfixes don't spam the review queue.
- **New league:** bump the config; the hub auto-builds a **Review Queue** of every page now behind. Clear each item by re-stamping (still valid → new version entry pointing at the existing file) or by creating a new frozen version file (content/style changed).

## Tags (open — no fixed categories)
Nav is emergent from tags + search. Seed tags: `mechanics, crafting, currency, endgame, bossing, build, skills, league, tool, note`. Add any tag freely.

## Interactive / logging tools
- Compute-only tools: inline JS, no backend.
- **Logging tools (persistent, cross-device):** call `/api/*` Pages Functions backed by **D1**.
  - Single writer for now; guard writes with a shared secret `WRITE_KEY` (env). Reads may be open.
  - Namespace data by `slug` (+ optional `league`) so logs survive restyles and can be segmented.
  - **Tool *code* freezes per version; tool *data* is persistent and shared across versions.** Keep that separation explicit.

## URLs
`/<game>/<slug>` (e.g. `/poe2/waystone-sustain`). Version selection via `?v=0.4` (default = `currentVersion`). Game in the path keeps trees separate and links shareable.

## Design — "Arcane Codex"
Dark slate bg, warm gold/amber accents, gothic-serif headings + clean sans body, readability first. Reuse **PoE item-rarity colors** for tags/status: normal grey `#c8c8c8`, magic blue `#8888ff`, rare yellow `#ffff77`, unique orange `#af6025`, currency tan `#aa9e82`, gem teal `#1ba29b`. The shell theme is living; frozen bodies keep their own inline styles.

## Repo layout
```
CLAUDE.md  AGENTS.md
astro.config.mjs  package.json  wrangler.jsonc  schema.sql
src/                   # Astro shell (hub chrome)
functions/            # Cloudflare Pages Functions (/api/*)
public/content/poe2/<slug>/…  public/content/poe1/<slug>/…
design/               # briefs, references
```

## How the owner asks (workflow)
- **New page:** "New poe2 page: `<title>`, tags […]" → create folder + meta + first `<league>.html`.
- **Update for league:** "Update `<slug>` for 0.6" → copy latest → `0.6.html`, edit, add version, set current.
- **Bump league:** "Bump poe2 to 0.6 `<name>` `<patch>`" → update config; refresh review queue.
- **Make a logging tool:** "Make `<slug>` log to D1" → add table + `/api` function + wire the HTML.

## Guardrails (do NOT)
- Don't edit or delete old version files. Don't share tool code across versions. Don't add a runtime DB for hub *content*. Don't bake nav into frozen bodies. Keep the shell static and bodies self-contained.
