// Cloudflare Pages Function: /api/log
// Backs simple single-user logging tools with D1.
//   GET  /api/log?tool=<slug>&league=<opt>            -> list entries (newest first)
//   POST /api/log   body: { tool, league?, key?, value }   header: x-write-key  -> insert
//
// Reads are open; writes require the WRITE_KEY secret (wrangler pages secret put WRITE_KEY).
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "GET") {
    const tool = url.searchParams.get("tool");
    const league = url.searchParams.get("league");
    if (!tool) return json({ error: "tool is required" }, 400);
    const stmt = league
      ? env.DB.prepare("SELECT * FROM entries WHERE tool=? AND league=? ORDER BY id DESC").bind(tool, league)
      : env.DB.prepare("SELECT * FROM entries WHERE tool=? ORDER BY id DESC").bind(tool);
    const { results } = await stmt.all();
    return json(results ?? []);
  }

  if (request.method === "POST") {
    if (env.WRITE_KEY && request.headers.get("x-write-key") !== env.WRITE_KEY) {
      return json({ error: "forbidden" }, 403);
    }
    const body = await request.json();
    if (!body || !body.tool) return json({ error: "tool is required" }, 400);
    await env.DB
      .prepare("INSERT INTO entries (tool, league, key, value_json) VALUES (?, ?, ?, ?)")
      .bind(body.tool, body.league ?? null, body.key ?? null, JSON.stringify(body.value ?? null))
      .run();
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
