'use client';

// ---------------------------------------------------------------------------
// Mantra practice. The signature of the app: a slowly rotating ring of the
// mantra around a single tap surface. Each tap is one recitation. At the
// mala count (default 108) the temple bell rings once and the round is
// recorded. No confetti. No scores. The bell is enough.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { loadDeities, type Deity } from '@/lib/data';
import { addSession, getSettings } from '@/lib/storage';
import { ringBell, tickTone } from '@/lib/bell';
import { ScreenTitle } from '@/components/ceremony';

const RING_ID = 'mantra-ring-path';

export default function PracticePage() {
  const [deity, setDeity] = useState<Deity | null>(null);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [completedAt, setCompletedAt] = useState<number | null>(null);
  const [mala, setMala] = useState(108);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    void loadDeities().then((d) =>
      setDeity(d.deities.find((x) => x.id === d.active) ?? d.deities[0]),
    );
    setMala(getSettings().malaCount);
  }, []);
  const mantra = deity?.mantra?.roman ?? 'OM DZAMBHALA DZALENDRAYE SOHA';

  function recite() {
    if (startRef.current === null) startRef.current = Date.now();
    const s = getSettings();
    if (s.haptics && 'vibrate' in navigator) navigator.vibrate(8);

    const next = count + 1;
    if (next >= mala) {
      if (s.sound) ringBell({ volume: 0.55 });
      addSession({
        type: 'mantra',
        deityId: deity?.id ?? 'yellow-dzambhala',
        mantraCount: mala,
        durationSec: Math.round((Date.now() - (startRef.current ?? Date.now())) / 1000),
      });
      startRef.current = null;
      setRounds((r) => r + 1);
      setCount(0);
      setCompletedAt(Date.now());
      setTimeout(() => setCompletedAt(null), 4000);
    } else {
      if (s.sound) tickTone();
      setCount(next);
    }
  }

  const progress = count / mala;
  const circumference = 2 * Math.PI * 46;

  return (
    <div className="flex min-h-dvh flex-col px-6">
      <ScreenTitle title="Practice" subtitle={deity?.name ?? 'Yellow Dzambhala'} />

      <div className="relative mx-auto mt-4 flex aspect-square w-full max-w-sm items-center justify-center">
        {/* Rotating mantra ring */}
        <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
          <defs>
            <path
              id={RING_ID}
              d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
              fill="none"
            />
          </defs>
          <g className="animate-ring">
            <text className="fill-gold/70 font-ceremonial" fontSize="6.4" letterSpacing="1.1">
              <textPath href={`#${RING_ID}`}>
                {`${mantra}  ·  ${mantra}  ·  `}
              </textPath>
            </text>
          </g>
          {/* Progress arc — a thin thread of gold filling the round */}
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="rgba(201,162,39,0.15)"
            strokeWidth="0.8"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#C9A227"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.7s var(--ease-organic)' }}
          />
        </svg>

        {/* The tap surface */}
        <button
          onClick={recite}
          aria-label="Recite mantra once"
          className="relative flex h-52 w-52 flex-col items-center justify-center rounded-full border gold-hairline bg-obsidian-raised/70 shadow-[inset_0_0_60px_rgba(201,162,39,0.08)] transition-transform duration-300 ease-organic active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <span className="font-ceremonial text-5xl tabular-nums text-gold-pale">{count}</span>
          <span className="mt-1 font-body text-sm italic text-bone/50">of {mala}</span>
          {rounds > 0 && (
            <span className="mt-2 font-body text-xs tracking-wide text-gold/60">
              {rounds} {rounds === 1 ? 'mala' : 'malas'} completed
            </span>
          )}
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-6 text-center font-body text-lg italic text-gold-pale transition-opacity duration-1000 ease-organic ${
          completedAt ? 'opacity-100' : 'opacity-0'
        }`}
      >
        The mala is complete. The bell has been offered.
      </p>

      <p className="mx-auto mt-auto max-w-xs pb-10 text-center font-body text-base leading-relaxed text-bone/50">
        Touch the circle with each recitation. Let the rhythm slow to the pace of breath.
      </p>
    </div>
  );
}
