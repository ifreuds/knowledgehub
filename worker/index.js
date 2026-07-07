// Cloudflare Worker entry for the PoE Knowledge Hub.
// Serves the static site (env.ASSETS) and hosts the D1-backed logging API at /api/log.
// Deployed by Workers Builds:  build `npm run build`  ->  deploy `npx wrangler deploy`.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/log") return handleLog(request, env);
    return env.ASSETS.fetch(request); // everything else = static assets from ./dist
  },
};

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type",
};

// /api/log
//   GET    ?tool=<slug>[&league=<x>]   -> newest-first rows
//   POST   { tool, league?, key?, value }   -> insert, returns { ok, id }
//   DELETE ?tool=<slug>&id=<n>         -> delete one row
// Single-user, private link: writes are open for now (no WRITE_KEY). Easy to gate later.
async function handleLog(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const tool = url.searchParams.get("tool");
      const league = url.searchParams.get("league");
      if (!tool) return json({ error: "tool is required" }, 400);
      const stmt = league
        ? env.DB.prepare("SELECT id, league, key, value_json, created_at FROM entries WHERE tool=? AND league=? ORDER BY id DESC LIMIT 1000").bind(tool, league)
        : env.DB.prepare("SELECT id, league, key, value_json, created_at FROM entries WHERE tool=? ORDER BY id DESC LIMIT 1000").bind(tool);
      const { results } = await stmt.all();
      return json(results ?? []);
    }
    if (request.method === "POST") {
      const body = await request.json();
      if (!body || !body.tool) return json({ error: "tool is required" }, 400);
      const res = await env.DB
        .prepare("INSERT INTO entries (tool, league, key, value_json) VALUES (?, ?, ?, ?)")
        .bind(body.tool, body.league ?? null, body.key ?? null, JSON.stringify(body.value ?? {}))
        .run();
      return json({ ok: true, id: res.meta.last_row_id });
    }
    if (request.method === "DELETE") {
      const tool = url.searchParams.get("tool");
      const id = url.searchParams.get("id");
      if (!tool || !id) return json({ error: "tool and id are required" }, 400);
      await env.DB.prepare("DELETE FROM entries WHERE tool=? AND id=?").bind(tool, id).run();
      return json({ ok: true });
    }
    return json({ error: "method not allowed" }, 405);
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });
}
