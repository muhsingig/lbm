import type { Config } from 'tailwindcss';

// Colour lives in CSS custom properties (app/globals.css) because every token is
// re-declared per chapter and interpolated on scroll. Tailwind is only used for
// layout, spacing and responsive utilities.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        label: ['var(--font-label)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        measure: '62ch',
      },
    },
  },
  plugins: [],
};

export default config;
