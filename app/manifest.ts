import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sheridan Quartier',
    short_name: 'Quartier',
    description: 'Die Plattform für Neuigkeiten, Schwarzes Brett, Kalender und Raumbuchungen im Sheridan Quartier.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f2f4ee',
    theme_color: '#f2f4ee',
    categories: ['community', 'lifestyle', 'productivity'],
    lang: 'de',
    shortcuts: [
      {
        name: 'Mein Quartier',
        short_name: 'Intern',
        url: '/intern/dashboard',
      },
      {
        name: 'Schwarzes Brett',
        short_name: 'Brett',
        url: '/intern/schwarzes-brett',
      },
      {
        name: 'Kalender',
        short_name: 'Kalender',
        url: '/intern/kalender',
      },
    ],
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
