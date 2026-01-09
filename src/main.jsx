import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
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
 * - Watchlist context provider
 * - Color mode script for dark theme
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <WatchlistProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WatchlistProvider>
    </ChakraProvider>
  </React.StrictMode>,
)

