import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sheridan Quartier',
    short_name: 'Quartier',
    description: 'Die Plattform für Neuigkeiten, Schwarzes Brett, Kalender und Raumbuchungen im Sheridan Quartier.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#edf3ec',
    theme_color: '#edf3ec',
    categories: ['community', 'lifestyle', 'productivity'],
    lang: 'de',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
