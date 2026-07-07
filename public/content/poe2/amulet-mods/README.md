# amulet-mods — parked data

Raw **PoE2 Amulet** mod pool, captured for league **0.5 (Rune of Aldurs)**.
This folder holds source data only — there is **no `meta.json` yet**, so the hub
loader skips it and it renders nowhere. It's parked for a future tool page to consume.

When the tool ships, follow the usual convention: add `meta.json` + a frozen
`0.5.html`, and inline this data into that version's HTML so the tool *code and
data freeze together* per league (see `CLAUDE.md` → "Interactive / logging tools").

## `mods.json`

A flat array of mod rows. 261 entries (97 prefix · 152 suffix · 12 corrupted;
221 Base · 31 Desecrated · 9 Essence).

| field    | meaning                                                                 |
|----------|-------------------------------------------------------------------------|
| `mod`    | mod text, with `#` marking each rolled value                            |
| `affix`  | `prefix` \| `suffix` \| `corrupted`                                     |
| `group`  | source pool: `Base` \| `Desecrated` \| `Essence`                        |
| `tier`   | tier number (higher = weaker/earlier)                                   |
| `ilvl`   | minimum item level the tier can roll at                                 |
| `weight` | spawn weight within its pool (`0` = not naturally rollable)             |
| `values` | JSON-encoded roll range string, e.g. `"[[1,2]]"`, `"[3]"`, or `null`    |
