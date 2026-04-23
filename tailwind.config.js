/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Editorial — big serif, editorial feel
        editorial: ['"Fraunces"', 'serif'],
        // Dashboard — precise, data-forward
        dashboard: ['"Bricolage Grotesque"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // Atlas — classic reference book
        atlas: ['"Cormorant Garamond"', 'serif'],
        atlasBody: ['"EB Garamond"', 'serif'],
        // Playful — bouncy, energetic
        playful: ['"Cabinet Grotesk"', 'sans-serif'],
        playfulBody: ['"Satoshi"', 'sans-serif'],
      },
      colors: {
        // Editorial
        ink: '#0F0F0F',
        cream: '#F5F1E8',
        // Atlas
        atlas: {
          paper: '#EDE4D3',
          ink: '#1C2E4A',
          oxblood: '#6B1E1E',
        },
        // Dashboard
        dash: {
          bg: '#0A0E14',
          panel: '#121821',
          grid: '#1C2532',
          cyan: '#5EEAD4',
          amber: '#FBBF24',
          rose: '#FB7185',
          dim: '#64748B',
        },
        // Playful
        play: {
          mint: '#7CF5C4',
          magenta: '#FF5BAE',
          sun: '#FFD447',
          sky: '#6BC6FF',
          deep: '#221A4C',
        },
      },
    },
  },
  plugins: [],
};
