'use client';

// ---------------------------------------------------------------------------
// Dedication of merit. The practice closes here: the prayer is read, the
// button is held — dedication takes a moment of steadiness, not a click —
// and the deep bell seals it.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { loadPrayers, type Prayer } from '@/lib/data';
import { addSession, getSettings } from '@/lib/storage';
import { ringBell } from '@/lib/bell';
import { KnotDivider, ScreenTitle } from '@/components/ceremony';

const HOLD_MS = 3000;

export default function MeritPage() {
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dedicated, setDedicated] = useState(false);
  const raf = useRef(0);
  const start = useRef(0);

  useEffect(() => {
    void loadPrayers().then((p) => setPrayer(p.prayers[0] ?? null));
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function beginHold() {
    if (dedicated) return;
    setHolding(true);
    start.current = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start.current) / HOLD_MS, 1);
      setProgress(p);
      if (p >= 1) {
        complete();
      } else {
        raf.current = requestAnimationFrame(step);
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  function endHold() {
    if (dedicated) return;
    cancelAnimationFrame(raf.current);
    setHolding(false);
    setProgress(0);
  }

  function complete() {
    cancelAnimationFrame(raf.current);
    setHolding(false);
    setProgress(1);
    setDedicated(true);
    const s = getSettings();
    if (s.sound) ringBell({ fundamental: 392, volume: 0.6 }); // deeper bell
    if (s.haptics && 'vibrate' in navigator) navigator.vibrate([20, 60, 20]);
    addSession({ type: 'dedication', deityId: 'yellow-dzambhala' });
    window.setTimeout(() => {
      setDedicated(false);
      setProgress(0);
    }, 6000);
  }

  return (
    <div className="flex min-h-dvh flex-col px-6">
      <ScreenTitle title="Dedication" subtitle="So the merit is not lost" />

      <blockquote className="animate-slow-fade mx-auto mt-4 max-w-xs text-center">
        {prayer?.lines.map((line, i) => (
          <p
            key={i}
            className="font-body text-xl italic leading-loose text-bone/85"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {line}
          </p>
        ))}
      </blockquote>

      <KnotDivider />

      <div className="mx-auto mt-6 flex flex-col items-center pb-12">
        <button
          onPointerDown={beginHold}
          onPointerUp={endHold}
          onPointerLeave={endHold}
          onKeyDown={(e) => e.key === 'Enter' && !holding && beginHold()}
          onKeyUp={(e) => e.key === 'Enter' && endHold()}
          aria-label="Hold to dedicate the merit"
          className="relative flex h-36 w-36 items-center justify-center rounded-full border gold-hairline bg-obsidian-raised/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(201,162,39,0.15)" strokeWidth="1.5" />
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 47}
              strokeDashoffset={2 * Math.PI * 47 * (1 - progress)}
            />
          </svg>
          <span className="px-4 text-center font-ceremonial text-[0.7rem] leading-relaxed tracking-[0.2em] text-gold-pale">
            {dedicated ? 'DEDICATED' : holding ? 'HOLD…' : 'HOLD TO DEDICATE'}
          </span>
        </button>

        <p
          aria-live="polite"
          className={`mt-6 max-w-xs text-center font-body text-lg italic text-bone/70 transition-opacity duration-1000 ease-organic ${
            dedicated ? 'opacity-100' : 'opacity-0'
          }`}
        >
          The merit has been dedicated to the benefit of all beings.
        </p>
      </div>
    </div>
  );
}
