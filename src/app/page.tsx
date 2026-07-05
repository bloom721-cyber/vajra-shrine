'use client';

// ---------------------------------------------------------------------------
// The Shrine. The visitor arrives here — not a dashboard, a room.
// Layers (per /data/shrine.json): background → deity → halo → smoke → vignette,
// wrapped in a 24s ken-burns breath. Every layer degrades gracefully while
// assets are still placeholders.
// ---------------------------------------------------------------------------

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadDeities, loadShrine, type Deity, type ShrineConfig } from '@/lib/data';
import { EndlessKnot, GoldenDust, SmartImage, SmartVideo } from '@/components/ceremony';

export default function ShrinePage() {
  const [deity, setDeity] = useState<Deity | null>(null);
  const [shrine, setShrine] = useState<ShrineConfig | null>(null);

  useEffect(() => {
    void loadDeities().then((d) =>
      setDeity(d.deities.find((x) => x.id === d.active) ?? d.deities[0]),
    );
    void loadShrine().then((s) => setShrine(s.shrine));
  }, []);

  return (
    <div className="vignette relative flex min-h-dvh flex-col overflow-hidden">
      <Link
        href="/settings/"
        aria-label="Settings"
        className="absolute right-5 top-5 z-20 rounded-full border gold-hairline bg-obsidian/50 px-4 py-1.5 font-ceremonial text-[0.6rem] tracking-[0.25em] text-bone/50 backdrop-blur-sm transition-colors duration-700 hover:text-gold-pale focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        SETTINGS
      </Link>

      {/* --- Layer 0: environment ------------------------------------------ */}
      <div className="absolute inset-0 animate-ken-burns">
        {shrine && (
          <SmartVideo
            src={shrine.heroLoop}
            className="absolute inset-0 h-full w-full object-cover"
            fallback={
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1c1608_0%,#0b0b0d_62%,#060607_100%)]" />
            }
          />
        )}
      </div>

      {/* --- Layer 1: candle glow rising from below ------------------------- */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 animate-breath bg-gradient-to-t from-gold-dim/25 via-gold-dim/5 to-transparent" />

      {/* --- Layer 2: the deity --------------------------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center pb-16">
        <div className="relative flex h-72 w-72 items-center justify-center">
          <div className="animate-halo absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.4)_0%,rgba(201,162,39,0.08)_55%,transparent_72%)]" />
          {deity?.assets && (
            <SmartImage
              src={deity.assets.portrait}
              alt={deity.name}
              className="relative h-64 w-64 rounded-full object-cover shadow-[0_0_80px_rgba(201,162,39,0.25)]"
              fallback={
                <div className="relative flex h-56 w-56 items-center justify-center rounded-full border gold-hairline bg-obsidian-raised/60">
                  <EndlessKnot size={96} />
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* --- Layer 3: golden dust ------------------------------------------- */}
      <GoldenDust />

      {/* --- Foreground: names and the single door inward -------------------- */}
      <div className="relative z-10 mt-auto flex flex-col items-center px-8 pb-14 text-center">
        <p className="animate-slow-fade font-body text-base tracking-wide text-bone/60">
          {deity?.epithet ?? ''}
        </p>
        <h1 className="animate-rise mt-1 font-ceremonial text-3xl tracking-[0.2em] text-gold-pale">
          {(deity?.name ?? 'Yellow Dzambhala').toUpperCase()}
        </h1>
        {deity?.tibetan && (
          <p className="mt-2 text-xl text-gold/80" lang="bo">
            {deity.tibetan}
          </p>
        )}
        <Link
          href="/practice/"
          className="mt-8 rounded-full border gold-hairline bg-obsidian/60 px-10 py-3 font-ceremonial text-sm tracking-[0.25em] text-gold-pale backdrop-blur-sm transition-colors duration-700 ease-organic hover:border-gold/60 hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          BEGIN PRACTICE
        </Link>
      </div>
    </div>
  );
}
