// ---------------------------------------------------------------------------
// Temple bell, synthesized with the Web Audio API. No audio files required.
//
// A real bronze bell is inharmonic: its partials are not integer multiples of
// the fundamental. The ratios below approximate a small Himalayan hand bell —
// hum, prime, tierce, quint, nominal — each with its own decay. A short burst
// of filtered noise supplies the strike transient.
// ---------------------------------------------------------------------------

let ctx: AudioContext | null = null;

function audioContext(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface Partial {
  ratio: number;
  gain: number;
  decay: number; // seconds to fall ~60 dB
}

const BELL_PARTIALS: Partial[] = [
  { ratio: 0.5, gain: 0.22, decay: 9.0 }, // hum
  { ratio: 1.0, gain: 1.0, decay: 7.0 }, // prime
  { ratio: 1.183, gain: 0.32, decay: 5.5 },
  { ratio: 1.506, gain: 0.28, decay: 4.5 }, // quint
  { ratio: 2.0, gain: 0.24, decay: 3.5 }, // nominal
  { ratio: 2.514, gain: 0.12, decay: 2.5 },
  { ratio: 2.662, gain: 0.09, decay: 2.0 },
  { ratio: 3.011, gain: 0.06, decay: 1.6 },
];

export function ringBell(opts: { fundamental?: number; volume?: number } = {}): void {
  const { fundamental = 523.25, volume = 0.5 } = opts;
  const ac = audioContext();
  const now = ac.currentTime;

  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);

  // Strike transient — a breath of noise through a bandpass.
  const noiseDur = 0.04;
  const noiseBuf = ac.createBuffer(1, ac.sampleRate * noiseDur, ac.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const noise = ac.createBufferSource();
  noise.buffer = noiseBuf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = fundamental * 2;
  bp.Q.value = 1.2;
  const noiseGain = ac.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + noiseDur);
  noise.connect(bp).connect(noiseGain).connect(master);
  noise.start(now);

  // Ringing partials — slight random detune so no two strikes are identical.
  for (const p of BELL_PARTIALS) {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = fundamental * p.ratio * (1 + (Math.random() - 0.5) * 0.002);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(p.gain, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + p.decay + 0.1);
  }
}

// A quieter, shorter voice for each bead of the mala.
export function tickTone(volume = 0.12): void {
  const ac = audioContext();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 1046.5;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(volume, now + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  osc.connect(g).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}
