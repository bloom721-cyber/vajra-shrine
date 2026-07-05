'use client';

// ---------------------------------------------------------------------------
// Settings. Few, quiet, and honest. Reduced motion can defer to the system
// or be forced off; the choice is applied immediately via <html data-motion>.
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { getSettings, saveSettings, type Settings } from '@/lib/storage';
import { ScreenTitle } from '@/components/ceremony';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function update(patch: Partial<Settings>) {
    const next = saveSettings(patch);
    setSettings(next);
    document.documentElement.dataset.motion = next.motion === 'off' ? 'off' : '';
  }

  if (!settings) return <div className="min-h-dvh" />;

  return (
    <div className="min-h-dvh px-6">
      <ScreenTitle title="Settings" subtitle="The keeping of the shrine" />

      <div className="mx-auto max-w-sm space-y-6 pb-12">
        <Toggle
          label="Sound"
          description="Bell and bead tones"
          value={settings.sound}
          onChange={(v) => update({ sound: v })}
        />
        <Toggle
          label="Haptics"
          description="A faint pulse with each recitation"
          value={settings.haptics}
          onChange={(v) => update({ haptics: v })}
        />

        <fieldset className="rounded border gold-hairline bg-obsidian-raised/40 px-4 py-4">
          <legend className="px-1 font-ceremonial text-xs tracking-[0.2em] text-gold-pale">
            MOTION
          </legend>
          <div className="mt-1 flex gap-2">
            {(['system', 'on', 'off'] as const).map((m) => (
              <button
                key={m}
                onClick={() => update({ motion: m })}
                aria-pressed={settings.motion === m}
                className={`flex-1 rounded-full border px-3 py-2 font-body text-sm capitalize transition-colors duration-500 ease-organic focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  settings.motion === m
                    ? 'border-gold/60 text-gold-pale'
                    : 'gold-hairline text-bone/50'
                }`}
              >
                {m === 'system' ? 'Follow system' : m}
              </button>
            ))}
          </div>
          <p className="mt-3 font-body text-sm italic text-bone/50">
            When motion is off, the shrine holds perfectly still.
          </p>
        </fieldset>

        <fieldset className="rounded border gold-hairline bg-obsidian-raised/40 px-4 py-4">
          <legend className="px-1 font-ceremonial text-xs tracking-[0.2em] text-gold-pale">
            MALA COUNT
          </legend>
          <div className="mt-1 flex gap-2">
            {[7, 21, 108].map((n) => (
              <button
                key={n}
                onClick={() => update({ malaCount: n })}
                aria-pressed={settings.malaCount === n}
                className={`flex-1 rounded-full border px-3 py-2 font-body text-base tabular-nums transition-colors duration-500 ease-organic focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  settings.malaCount === n
                    ? 'border-gold/60 text-gold-pale'
                    : 'gold-hairline text-bone/50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 font-body text-sm italic text-bone/50">
            Recitations in one round. The bell rings when the round completes.
          </p>
        </fieldset>
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded border gold-hairline bg-obsidian-raised/40 px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      <span>
        <span className="block font-ceremonial text-xs tracking-[0.2em] text-gold-pale">
          {label.toUpperCase()}
        </span>
        <span className="mt-1 block font-body text-sm italic text-bone/50">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-500 ease-organic ${
          value ? 'border-gold/60 bg-gold/25' : 'gold-hairline bg-obsidian'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all duration-500 ease-organic ${
            value ? 'left-[calc(100%-1.35rem)] bg-gold' : 'left-0.5 bg-bone/40'
          }`}
          style={{ height: '1.1rem', width: '1.1rem' }}
        />
      </span>
    </button>
  );
}
