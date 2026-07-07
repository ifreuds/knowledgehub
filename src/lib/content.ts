import fs from 'node:fs';
import path from 'node:path';
import { GAMES, type Game } from '../config';

// Frozen bodies + meta live under public/content/<game>/<slug>/.
// Read at build time (Astro frontmatter runs in Node), so plain fs is fine.
const CONTENT_ROOT = path.join(process.cwd(), 'public', 'content');

export type Version = {
  league: string;
  leagueName?: string;
  patch?: string;
  file: string;
  updated?: string;
  changelog?: string;
};

export type Meta = {
  title: string;
  slug: string;
  game: string;
  tags: string[];
  summary?: string;
  image?: string;
  type: 'article' | 'tool';
  interactive?: boolean;
  currentVersion: string;
  updatedForLeague: string;
  versions: Version[];
};

export type PageStatus = 'current' | 'needs-review';

export type PageEntry = Meta & {
  status: PageStatus;
  currentLeagueLabel: string;
  url: string;
};

function readMetaForGame(gameKey: string): Meta[] {
  const dir = path.join(CONTENT_ROOT, gameKey);
  if (!fs.existsSync(dir)) return [];
  const metas: Meta[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const metaPath = path.join(dir, entry.name, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as Meta;
      meta.slug = meta.slug || entry.name;
      meta.game = meta.game || gameKey;
      meta.tags = meta.tags || [];
      meta.versions = meta.versions || [];
      metas.push(meta);
    } catch (err) {
      console.warn(`[content] skipping ${metaPath}: ${(err as Error).message}`);
    }
  }
  return metas;
}

export function computeStatus(meta: Meta, game: Game): PageStatus {
  return meta.updatedForLeague === game.currentLeague.league ? 'current' : 'needs-review';
}

export function getPages(gameKey: string): PageEntry[] {
  const game = GAMES[gameKey];
  if (!game) return [];
  return readMetaForGame(gameKey)
    .map((meta) => ({
      ...meta,
      status: computeStatus(meta, game),
      currentLeagueLabel: game.currentLeague.league,
      url: `/${gameKey}/${meta.slug}`,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPage(gameKey: string, slug: string): PageEntry | undefined {
  return getPages(gameKey).find((p) => p.slug === slug);
}

export function getReviewQueue(gameKey: string): PageEntry[] {
  return getPages(gameKey).filter((p) => p.status === 'needs-review');
}

export function getTags(gameKey: string): string[] {
  const set = new Set<string>();
  for (const p of getPages(gameKey)) for (const t of p.tags) set.add(t);
  return [...set].sort();
}
