import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: { DEFAULT: '#0B0B0D', raised: '#141416', deep: '#060607' },
        gold: { DEFAULT: '#C9A227', dim: '#8C6D1F', pale: '#E8CF7A' },
        bone: '#EDE6D6',
        ember: '#7A2E1D',
      },
      fontFamily: {
        ceremonial: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-cormorant)', 'serif'],
      },
      transitionTimingFunction: { organic: 'cubic-bezier(0.33, 0, 0.2, 1)' },
    },
  },
  plugins: [],
};
export default config;
