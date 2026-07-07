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
// Mapping matches the Ornate design handoff.
export const RARITY: Record<string, string> = {
  mechanics: '#c8c8c8', // normal grey
  note: '#c8c8c8',
  build: '#8888ff',     // magic blue
  tool: '#8888ff',
  endgame: '#ffff77',   // rare yellow
  league: '#ffff77',
  bossing: '#af6025',   // unique orange
  crafting: '#af6025',
  currency: '#aa9e82',  // currency tan
  skills: '#1ba29b',    // gem teal
  gem: '#1ba29b',
};
