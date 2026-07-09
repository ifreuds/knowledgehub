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
  "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type",
};

// /api/log
//   GET    ?tool=<slug>[&league=<x>][&key=<k>]   -> newest-first rows
//   POST   { tool, league?, key?, value }        -> insert, returns { ok, id }
//   PUT    ?tool=<slug>&id=<n>  { value }         -> replace value_json (+ bump updated_at)
//   DELETE ?tool=<slug>&id=<n>                    -> delete one row
// Single-user, private link: writes are open for now (no WRITE_KEY). Easy to gate later.
async function handleLog(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const tool = url.searchParams.get("tool");
      const league = url.searchParams.get("league");
      const key = url.searchParams.get("key");
      if (!tool) return json({ error: "tool is required" }, 400);
      const where = ["tool=?"];
      const args = [tool];
      if (league) { where.push("league=?"); args.push(league); }
      if (key) { where.push("key=?"); args.push(key); }
      // Bounded, overridable page size (default high enough that log totals aren't silently truncated).
      const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "5000", 10) || 5000, 1), 20000);
      const sql = "SELECT id, league, key, value_json, created_at, updated_at FROM entries WHERE "
        + where.join(" AND ") + " ORDER BY id DESC LIMIT ?";
      args.push(limit);
      const { results } = await env.DB.prepare(sql).bind(...args).all();
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
    if (request.method === "PUT") {
      const tool = url.searchParams.get("tool");
      const id = url.searchParams.get("id");
      if (!tool || !id) return json({ error: "tool and id are required" }, 400);
      const body = await request.json();
      const res = await env.DB
        .prepare("UPDATE entries SET value_json=?, updated_at=datetime('now') WHERE tool=? AND id=?")
        .bind(JSON.stringify(body?.value ?? {}), tool, id)
        .run();
      return json({ ok: true, changed: res.meta.changes });
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
