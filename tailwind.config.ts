import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sheridan-blue': '#2563EB',
        'wagnis-orange': '#EA580C',
        'wogenau-green': '#16A34A',
        'warm-white': '#FAFAF8',
        'anthracite': '#1C1C1A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        'default': '#FAFAF8',
      },
    },
  },
  plugins: [],
}

export default config
