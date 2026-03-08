import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import theme from './theme'
import { WatchlistProvider } from './contexts/WatchlistContext'
import { RemindersProvider } from './contexts/RemindersContext'
import { AuthProvider } from './contexts/AuthContext'
import { RegionProvider } from './contexts/RegionContext'
import './i18n/config' // Initialize i18n
import './index.css'

/**
 * Application entry point
 * Initializes React app with providers:
 * - ChakraUI theme provider
 * - HelmetProvider for SEO meta tags
 * - Watchlist context provider
 * - Reminders context provider
 * - Auth provider
 * - Color mode script for dark theme
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <RegionProvider>
            <WatchlistProvider>
              <RemindersProvider>
                <App />
              </RemindersProvider>
            </WatchlistProvider>
          </RegionProvider>
        </AuthProvider>
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

