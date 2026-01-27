import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import theme from './theme'
import { WatchlistProvider } from './contexts/WatchlistContext'
import { AuthProvider } from './contexts/AuthContext'
import './i18n/config' // Initialize i18n
import './index.css'

/**
 * Application entry point
 * Initializes React app with providers:
 * - ChakraUI theme provider
 * - HelmetProvider for SEO meta tags
 * - Watchlist context provider
 * - Auth provider
 * - Color mode script for dark theme
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </AuthProvider>
      </ChakraProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

