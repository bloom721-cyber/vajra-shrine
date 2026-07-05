// ---------------------------------------------------------------------------
// Practice history and settings, persisted in localStorage.
// No streak-fire, no badges — records are kept the way a shrine keeper would
// keep them: quietly and accurately.
// ---------------------------------------------------------------------------

export type SessionType = 'mantra' | 'offering' | 'dedication';

export interface Session {
  id: string;
  type: SessionType;
  deityId: string;
  at: string; // ISO timestamp
  durationSec?: number;
  mantraCount?: number;
  offeringId?: string;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  motion: 'system' | 'on' | 'off';
  malaCount: number;
}

const SESSIONS_KEY = 'dz.sessions.v1';
const SETTINGS_KEY = 'dz.settings.v1';

export const defaultSettings: Settings = {
  sound: true,
  haptics: true,
  motion: 'system',
  malaCount: 108,
};

const isBrowser = () => typeof window !== 'undefined';

export function getSessions(): Session[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? '[]') as Session[];
  } catch {
    return [];
  }
}

export function addSession(s: Omit<Session, 'id' | 'at'>): Session {
  const session: Session = {
    ...s,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
  };
  const all = [session, ...getSessions()].slice(0, 2000);
  if (isBrowser()) localStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
  return session;
}

export function getSettings(): Settings {
  if (!isBrowser()) return defaultSettings;
  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<Settings>),
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(patch: Partial<Settings>): Settings {
  const next = { ...getSettings(), ...patch };
  if (isBrowser()) localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

// ---------------------------------------------------------------------------
// Gentle statistics — totals only, no comparisons, no pressure.
// ---------------------------------------------------------------------------

export interface PracticeStats {
  totalMantras: number;
  totalOfferings: number;
  totalDedications: number;
  daysOfPractice: number;
  firstPractice?: string;
}

export function getStats(): PracticeStats {
  const sessions = getSessions();
  const days = new Set(sessions.map((s) => s.at.slice(0, 10)));
  return {
    totalMantras: sessions.reduce((n, s) => n + (s.mantraCount ?? 0), 0),
    totalOfferings: sessions.filter((s) => s.type === 'offering').length,
    totalDedications: sessions.filter((s) => s.type === 'dedication').length,
    daysOfPractice: days.size,
    firstPractice: sessions.length ? sessions[sessions.length - 1].at : undefined,
  };
}
