// ---------------------------------------------------------------------------
// src/types/index.ts equivalents + data loaders. The app reads /public/data —
// never hardcode asset paths in components.
// ---------------------------------------------------------------------------

export interface Deity {
  id: string;
  name: string;
  tibetan?: string;
  sanskrit?: string;
  epithet?: string;
  mantra?: { roman: string; tibetan?: string; recommendedCounts: number[] };
  palette?: { primary: string; secondary: string; background: string };
  assets?: { portrait: string; shrineLoop: string; mantraAudio: string };
  status: 'active' | 'planned';
}

export interface Offering {
  id: string;
  name: string;
  symbolism: string;
  icon: string;
  image: string;
  video: string;
  sound: string;
  durationMs: number;
}

export interface Prayer {
  id: string;
  title: string;
  lines: string[];
  audio?: string;
}

export interface ShrineLayer {
  id: string;
  z: number;
  asset: string;
  animation?: string;
  blendMode?: string;
}

export interface ShrineConfig {
  deityId: string;
  background: string;
  heroLoop: string;
  ambienceAudio: string;
  layers: ShrineLayer[];
  kenBurns: { enabled: boolean; respectReducedMotion: boolean };
}

async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json() as Promise<T>;
}

export const loadDeities = () =>
  loadJSON<{ active: string; deities: Deity[] }>('/data/deities.json');
export const loadOfferings = () =>
  loadJSON<{ offerings: Offering[] }>('/data/offerings.json');
export const loadPrayers = () => loadJSON<{ prayers: Prayer[] }>('/data/prayers.json');
export const loadShrine = () => loadJSON<{ shrine: ShrineConfig }>('/data/shrine.json');
