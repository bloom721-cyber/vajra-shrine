'use client';

// ---------------------------------------------------------------------------
// Shared ceremonial components.
// ---------------------------------------------------------------------------

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// --- Endless knot: drawn inline so it renders before any asset exists. -----
export function EndlessKnot({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <path
        d="M20 12h12a8 8 0 0 1 8 8v4m0 0v16m0-16h4a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8h-4m0 0v4a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8v-4m28 0H24m-4-28h-4a8 8 0 0 0-8 8v4a8 8 0 0 0 8 8h4m0-20v20m0 0v16m20-24H24"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function KnotDivider() {
  return (
    <div className="my-4 flex items-center justify-center gap-4" aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
      <EndlessKnot size={26} />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="animate-rise pt-14 text-center">
      <h1 className="font-ceremonial text-[1.7rem] tracking-[0.18em] text-gold-pale">
        {title.toUpperCase()}
      </h1>
      {subtitle && (
        <p className="mt-1 font-body text-lg italic text-bone/70">{subtitle}</p>
      )}
      <KnotDivider />
    </header>
  );
}

// --- SmartMedia: renders the real asset when present, a worthy fallback ----
// --- when the file is still a placeholder. Zero-byte media fires onError. --
export function SmartVideo({
  src,
  className,
  fallback,
}: {
  src: string;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <video
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
    />
  );
}

export function SmartImage({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

// --- Golden dust: slow canvas particles, silenced by reduced motion. -------
export function GoldenDust({ count = 26 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.documentElement.dataset.motion === 'off') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const g = canvas.getContext('2d')!;
    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      vy: 0.008 + Math.random() * 0.02, // % of height per second — very slow
      drift: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      g.clearRect(0, 0, canvas.width, canvas.height);
      for (const m of motes) {
        m.y -= m.vy * dt;
        m.x += m.drift * dt + Math.sin(t / 4000 + m.phase) * 0.00006;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const tw = 0.35 + 0.3 * Math.sin(t / 1600 + m.phase);
        g.beginPath();
        g.arc(m.x * canvas.width, m.y * canvas.height, m.r * dpr, 0, Math.PI * 2);
        g.fillStyle = `rgba(232, 207, 122, ${tw})`;
        g.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

// --- Bottom navigation: five quiet doors. -----------------------------------
const NAV = [
  { href: '/', label: 'Shrine' },
  { href: '/practice/', label: 'Practice' },
  { href: '/offerings/', label: 'Offerings' },
  { href: '/merit/', label: 'Merit' },
  { href: '/history/', label: 'Record' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t gold-hairline bg-obsidian/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {NAV.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.slice(0, -1));
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`block py-3 text-center font-ceremonial text-[0.62rem] tracking-[0.22em] transition-colors duration-700 ease-organic ${
                  active ? 'text-gold-pale' : 'text-bone/45 hover:text-bone/75'
                }`}
              >
                <span
                  className={`mx-auto mb-1 block h-1 w-1 rounded-full transition-opacity duration-700 ${
                    active ? 'bg-gold opacity-100' : 'opacity-0'
                  }`}
                />
                {item.label.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
