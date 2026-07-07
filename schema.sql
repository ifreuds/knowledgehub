-- D1 schema for the PoE Knowledge Hub logging tools.
-- Generic single-table backing for simple loggers; bespoke tables can be added per tool later.
-- Apply with:  wrangler d1 execute poe-hub --file=./schema.sql   (add --remote to hit production)

CREATE TABLE IF NOT EXISTS entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  tool       TEXT NOT NULL,                       -- slug of the logging tool
  league     TEXT,                                -- optional league segmentation (e.g. "0.5")
  key        TEXT,                                -- optional row key within a tool
  value_json TEXT NOT NULL,                       -- JSON payload
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_entries_tool ON entries (tool, league);
