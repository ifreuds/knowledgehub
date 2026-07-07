# Design brief — PoE Knowledge Hub, landing (hub) page

I'm building a private, dark, PoE-flavored personal **Path of Exile 2** knowledge hub.
Produce **2–3 DISTINCT visual mockups of the LANDING / HUB page only**, each as a
self-contained responsive HTML+CSS artifact (inline CSS fine, no build tools).
Dark theme, desktop-first but must work on mobile. Use placeholder-but-realistic
PoE2 content. Label each direction so I can compare.

## Aesthetic — "Arcane Codex"
Dark gothic fantasy meets a clean reference wiki — atmospheric but **highly readable**
(in-game item tooltip crossed with a good docs site).
- **Background:** near-black slate (~`#0e0f12`); subtle vignette/stone texture ok, never at the cost of legibility.
- **Accent:** warm gold/amber (~`#c8a04f`). Headings bone/parchment (~`#e8e2d0`); body soft grey (~`#b8b3a7`).
- **Functional palette — reuse PoE item-rarity colors** for tags + status badges:
  normal grey `#c8c8c8`, magic blue `#8888ff`, rare yellow `#ffff77`, unique orange `#af6025`, currency tan `#aa9e82`, gem teal `#1ba29b`.
- **Type:** gothic/serif display headings (Cinzel/Trajan-ish) + clean humanist sans body. Suggest a pairing.
- **Ornament:** restrained gold hairlines / filigree card corners. Readability wins.

## The hub page must contain
1. **Sticky header:** wordmark, prominent game toggle "PoE2 | PoE1", search field.
2. **Current-league hero:** big "0.5 — RUNE OF ALDURS" with a smaller "patch 0.5.4b" tag.
3. **Status strip:** "● 12 up to date · ○ 3 need review for 0.5" + a "Review Queue" button. This is the hub's killer feature — make it feel important.
4. **Tag filter** (sidebar or horizontal bar): mechanics, crafting, currency, endgame, bossing, build, skills, league, tool, note.
5. **Article grid:** responsive cards (3-up desktop → 1-up mobile), 6–9 examples. Each card: title, 1–3 rarity-colored tags, a status badge (🟢 Up to date · 0.5 / 🟡 Needs review · last 0.4), last-updated date, and a small ⚙ marker on interactive ones.
6. **Minimal footer.**

## Flavor
A little arcane in the chrome ("The Codex", "Chronicle", "Review Queue"), practical everywhere else.

## Deliver
2–3 clearly different takes so I can pick a direction:
- **A — Ornate/atmospheric** (texture, filigree, immersive)
- **B — Tooltip-minimal** (clean, dense item-tooltip feel, less ornament)
- **C — Dashboard-first** (status + review queue front and center)

Each as its own self-contained HTML artifact.
