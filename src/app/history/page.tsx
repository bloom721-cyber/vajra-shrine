'use client';

// ---------------------------------------------------------------------------
// The Record. Kept the way a shrine keeper keeps a ledger: totals and a
// simple chronology. No streaks, no comparisons, no pressure to return.
// ---------------------------------------------------------------------------

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSessions, getStats, type PracticeStats, type Session } from '@/lib/storage';
import { KnotDivider, ScreenTitle } from '@/components/ceremony';

export default function HistoryPage() {
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setStats(getStats());
    setSessions(getSessions().slice(0, 60));
  }, []);

  const empty = sessions.length === 0;

  return (
    <div className="min-h-dvh px-6">
      <ScreenTitle title="The Record" subtitle="What has been offered" />

      {empty ? (
        <div className="animate-slow-fade mt-16 text-center">
          <p className="font-body text-xl italic text-bone/60">
            The record is unwritten. The shrine is ready.
          </p>
          <Link
            href="/practice/"
            className="mt-8 inline-block rounded-full border gold-hairline px-8 py-3 font-ceremonial text-xs tracking-[0.25em] text-gold-pale transition-colors duration-700 hover:border-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            BEGIN PRACTICE
          </Link>
        </div>
      ) : (
        <>
          <dl className="animate-rise mx-auto grid max-w-sm grid-cols-2 gap-x-6 gap-y-5 text-center">
            <Stat label="Recitations" value={stats?.totalMantras ?? 0} />
            <Stat label="Days of practice" value={stats?.daysOfPractice ?? 0} />
            <Stat label="Offerings" value={stats?.totalOfferings ?? 0} />
            <Stat label="Dedications" value={stats?.totalDedications ?? 0} />
          </dl>

          <KnotDivider />

          <ul className="space-y-3 pb-12">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-baseline justify-between rounded border gold-hairline bg-obsidian-raised/40 px-4 py-3"
              >
                <span className="font-body text-base text-bone/80">{describe(s)}</span>
                <time className="font-body text-sm italic text-bone/40" dateTime={s.at}>
                  {formatDate(s.at)}
                </time>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="font-ceremonial text-3xl tabular-nums text-gold-pale">{value}</dd>
      <dt className="mt-1 font-body text-sm italic text-bone/50">{label}</dt>
    </div>
  );
}

function describe(s: Session): string {
  switch (s.type) {
    case 'mantra':
      return `Mala of ${s.mantraCount ?? '—'} recitations`;
    case 'offering':
      return `${(s.offeringId ?? 'offering').replace(/-/g, ' ')} offered`.replace(/^./, (c) =>
        c.toUpperCase(),
      );
    case 'dedication':
      return 'Merit dedicated';
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
