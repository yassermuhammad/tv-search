import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/tv-search/' : '/',
  server: {
    host: true, // Allow external connections
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-*.png'],
      manifest: {
        name: 'TV Shows & Movies Search',
        short_name: 'TV Search',
        description: 'Discover your next favorite TV show or movie',
        theme_color: '#3182ce',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: process.env.NODE_ENV === 'production' ? '/tv-search/' : '/',
        start_url: process.env.NODE_ENV === 'production' ? '/tv-search/' : '/',
        icons: [
          {
            src: '/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.tvmaze\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tvmaze-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/static\.tvmaze\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tvmaze-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})

