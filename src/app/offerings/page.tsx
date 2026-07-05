'use client';

// ---------------------------------------------------------------------------
// Offerings. Six traditional offerings, each a small ceremony: choose,
// witness (video moment or its graceful fallback), and the offering is
// placed on the record. Slow by design — an offering cannot be rushed.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { loadOfferings, type Offering } from '@/lib/data';
import { addSession, getSettings } from '@/lib/storage';
import { ringBell } from '@/lib/bell';
import { EndlessKnot, ScreenTitle, SmartVideo } from '@/components/ceremony';

export default function OfferingsPage() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [active, setActive] = useState<Offering | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  useEffect(() => {
    void loadOfferings().then((o) => setOfferings(o.offerings));
  }, []);

  function begin(offering: Offering) {
    setActive(offering);
    setPlaced(null);
    window.setTimeout(() => {
      addSession({ type: 'offering', deityId: 'yellow-dzambhala', offeringId: offering.id });
      const s = getSettings();
      if (s.sound) ringBell({ fundamental: 659.25, volume: 0.35 });
      setPlaced(offering.name);
      window.setTimeout(() => setActive(null), 2200);
    }, offering.durationMs);
  }

  return (
    <div className="min-h-dvh px-6">
      <ScreenTitle title="Offerings" subtitle="Given freely, without expectation" />

      <ul className="mt-2 grid grid-cols-2 gap-4 pb-10">
        {offerings.map((o) => (
          <li key={o.id}>
            <button
              onClick={() => begin(o)}
              className="group flex w-full flex-col items-center rounded-lg border gold-hairline bg-obsidian-raised/50 px-4 py-6 text-center transition-colors duration-700 ease-organic hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border gold-hairline text-gold transition-colors duration-700 group-hover:text-gold-pale">
                <OfferingGlyph id={o.id} />
              </span>
              <span className="mt-3 font-ceremonial text-xs tracking-[0.18em] text-gold-pale">
                {o.name.toUpperCase()}
              </span>
              <span className="mt-2 font-body text-sm italic leading-snug text-bone/55">
                {o.symbolism}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* --- Ceremony overlay ------------------------------------------------ */}
      {active && (
        <div className="animate-slow-fade fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian-deep/95 px-10 text-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-full">
            <SmartVideo
              src={active.video}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(201,162,39,0.3)_0%,rgba(11,11,13,1)_75%)]">
                  <div className="animate-halo">
                    <EndlessKnot size={88} />
                  </div>
                </div>
              }
            />
          </div>
          <p aria-live="polite" className="mt-8 font-ceremonial text-lg tracking-[0.2em] text-gold-pale">
            {placed ? 'OFFERED' : active.name.toUpperCase()}
          </p>
          <p className="mt-3 max-w-xs font-body text-lg italic leading-relaxed text-bone/70">
            {placed
              ? `The ${active.name.toLowerCase()} has been placed upon the altar.`
              : active.symbolism}
          </p>
        </div>
      )}
    </div>
  );
}

// Line glyphs for each offering — inline so the screen is whole before the
// final icon SVGs arrive in /icons/offerings/.
function OfferingGlyph({ id }: { id: string }) {
  const stroke = { stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' as const };
  switch (id) {
    case 'water':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path {...stroke} d="M5 12c0 3.9 3.1 7 7 7s7-3.1 7-7H5Z" />
          <path {...stroke} d="M8 8c1.3 1 2.7 1 4 0s2.7-1 4 0" />
        </svg>
      );
    case 'butter-lamp':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path {...stroke} d="M12 4c1.8 2.2 1.8 4-0 5.6C10.2 8 10.2 6.2 12 4Z" />
          <path {...stroke} d="M7 13h10l-1.5 6h-7L7 13Z" />
        </svg>
      );
    case 'incense':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path {...stroke} d="M12 20V9" />
          <path {...stroke} d="M12 6c-1 -1.2 -1 -2.4 0 -3.5" />
          <path {...stroke} d="M8 20h8" />
        </svg>
      );
    case 'flower':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path {...stroke} d="M12 18c-4 0-6-2.5-6-5 2 .8 3.4 1 4.6.6C9.4 11 10 8.5 12 6c2 2.5 2.6 5 1.4 7.6 1.2.4 2.6.2 4.6-.6 0 2.5-2 5-6 5Z" />
        </svg>
      );
    case 'fruit':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <circle {...stroke} cx="9" cy="14" r="4" />
          <circle {...stroke} cx="15" cy="13" r="4" />
          <path {...stroke} d="M12 7c.5-1.5 1.5-2.3 3-2.5" />
        </svg>
      );
    case 'jewel':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <path {...stroke} d="M12 4 6 10l6 10 6-10-6-6Z" />
          <path {...stroke} d="M6 10h12M12 4l-2 6 2 10 2-10-2-6" />
        </svg>
      );
    default:
      return <EndlessKnot size={24} />;
  }
}
