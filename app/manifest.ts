import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mombi Care Spa',
    short_name: 'Mombi Care Spa',
    description: 'Spa chăm sóc da và massage thư giãn tại Buôn Ma Thuột.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f6f1',
    theme_color: '#8bb96e',
    icons: [
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
