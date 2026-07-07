# AGENTS.md

This project's conventions for **any AI agent or MCP** live in **[CLAUDE.md](./CLAUDE.md)**.
Read it in full before adding or changing anything. Key rules in one breath:

- Content-as-code, static, no runtime DB for content. Ship via `git push` → Cloudflare Pages.
- Two separate game trees: `content/poe2/…`, `content/poe1/…`.
- Living Astro shell renders hub chrome; content pages are self-contained frozen HTML bodies shown via `<iframe>`. Never restyle a frozen body.
- Freeze EVERYTHING per league version (text, images, tool code). Old version files are immutable — new league = new file.
- Status computed from league (not patch). Logging tools use Cloudflare D1 via `/api/*` Pages Functions, guarded by `WRITE_KEY`.
