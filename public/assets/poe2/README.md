# PoE2 shared image library

Item + currency icons pulled from **poe2db.tw** (`cdn.poe2db.tw`) on **2026-07-09**, league **0.5 (Rune of Aldurs)**.
Served as static assets from the site root, e.g. `/assets/poe2/items/amulets/base/AbsentAmulet.webp`.

## Rule: append-only
These are a **shared, additive** library reused across pages (tools, strategy notes, hub chrome).
To respect the *freeze-everything* architecture (see `CLAUDE.md`), **never mutate or delete an existing
file here** — a frozen body may reference it. Only add new files. If an icon must change, add it under a
new name. All icons are `WebP`, mostly `108×108` (a few legacy orbs are `80×80`); no resizing was needed.

> Self-hosted webfonts live one level up at `public/assets/fonts/` (Cinzel, Mulish, JetBrains Mono —
> latin `woff2` subsets, same append-only rule). Frozen bodies `@font-face` them from `/assets/fonts/…`
> instead of hitting a third-party font host, so a snapshot renders identically offline and forever.

## Layout
```
items/amulets/base/     17 amulet base-type icons  (PascalCase, e.g. StellarAmulet.webp)
items/amulets/unique/   26 unique amulet icons
currency/               420 currency icons, in poe2db sub-folders (see below)
currency/divine-orb.webp  stable alias for the Divine Orb (= currency/CurrencyModValues.webp),
                          used as the "divines-as-stars" profitability rating icon (src/components/Rating.astro)
```

### currency/ sub-folders
`(root)` core orbs · `Essence/` · `Runes/` · `Omens/` · `SoulCores/` + `PerfectSoulCores/` ·
`Breach/` (Breach catalysts) · `DistilledEmotions/` (Delirium) · `Expedition2/` + `Expedition/` ·
`Ritual/` · `IncursionCraftingOrbs/` · `Classic/`

### Core orb filename → in-game name
| file (`currency/…`) | item |
|---|---|
| `CurrencyModValues` | Divine Orb |
| `CurrencyRerollRare` | Chaos Orb |
| `CurrencyAddModToRare` | Exalted Orb |
| `CurrencyUpgradeMagicToRare` | Regal Orb |
| `CurrencyUpgradeToRare` | Orb of Alchemy |
| `CurrencyUpgradeToMagic` | Orb of Transmutation |
| `CurrencyAddModToMagic` | Orb of Augmentation |
| `CurrencyUpgradeToUnique` | Orb of Chance |
| `AnnullOrb` | Orb of Annulment |
| `CurrencyVaal` | Vaal Orb |
| `CurrencyDuplicate` | Mirror of Kalandra |
| `FracturingOrb` | Fracturing Orb |
| `HinekorasLock` | Hinekora's Lock |
| `CurrencyAddEquipmentSocket` | Artificer's Orb |
| `CurrencyRerollSocketNumbers01/02/03` | Lesser / Greater / Perfect Jeweller's Orb |
| `CurrencyGemQuality` | Gemcutter's Prism |

## Amulet base classification (poe2db metadata, 0.5)
Breach bases carry the priciest chaos-spam targets (the *Amulet Rolling* tool highlights them).

| group | bases |
|---|---|
| **Breach** | Absent, Corona, Lament, Portent |
| **Delirium** | Distorted, Twisted |
| **Core** | Gold, Solar, Stellar, Bloodstone, Lunar, Amber, Jade, Lapis, Pearlescent, Crimson, Azure |

> Breach/Delirium attribution comes from poe2db's internal base-type ids (`FourAmuletB*`, `FourAmuletDelirium*`);
> poe2db prints no explicit league-source tag, so treat it as a strong inference, not a hard label.
