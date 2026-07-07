// Per-game configuration. The current league drives 🟢/🟡 status across the hub.
// Bump the `currentLeague` here when a new league drops — every page behind it
// automatically flips to "needs review" and appears in the Review Queue.

export type League = { league: string; name: string; patch: string };
export type Game = { key: string; label: string; currentLeague: League };

export const GAMES: Record<string, Game> = {
  poe2: {
    key: 'poe2',
    label: 'PoE2',
    currentLeague: { league: '0.5', name: 'Rune of Aldurs', patch: '0.5.4b' },
  },
  poe1: {
    key: 'poe1',
    label: 'PoE1',
    // Placeholder — set the real current league when PoE1 content begins.
    currentLeague: { league: '3.26', name: 'TBD', patch: '' },
  },
};

export const GAME_ORDER = ['poe2', 'poe1'];
export const DEFAULT_GAME = 'poe2';

// Suggested tags for consistency — not enforced. Add any tag freely in meta.json.
export const SEED_TAGS = [
  'mechanics', 'crafting', 'currency', 'endgame',
  'bossing', 'build', 'skills', 'league', 'tool', 'note',
];

// PoE item-rarity palette, reused as a functional color system for tags/badges.
export const RARITY: Record<string, string> = {
  mechanics: '#8888ff', // magic blue
  skills: '#8888ff',
  crafting: '#aa9e82',  // currency tan
  currency: '#aa9e82',
  endgame: '#ffff77',   // rare yellow
  build: '#ffff77',
  bossing: '#af6025',   // unique orange
  league: '#af6025',
  tool: '#1ba29b',      // gem teal
  note: '#c8c8c8',      // normal grey
};
