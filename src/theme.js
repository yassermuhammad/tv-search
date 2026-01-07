import { extendTheme } from '@chakra-ui/react'

const netflixTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    netflix: {
      50: '#ffe5e5',
      100: '#ffb3b3',
      200: '#ff8080',
      300: '#ff4d4d',
      400: '#ff1a1a',
      500: '#E50914', // Netflix Red
      600: '#cc0811',
      700: '#b3070e',
      800: '#99060b',
      900: '#800508',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: '#141414', // Netflix dark background
        color: 'white',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        netflix: {
          bg: 'netflix.500',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '4px',
          _hover: {
            bg: 'netflix.600',
            transform: 'scale(1.05)',
          },
          _active: {
            bg: 'netflix.700',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Input: {
      variants: {
        netflix: {
          field: {
            bg: 'rgba(42, 42, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            _focus: {
              borderColor: 'netflix.500',
              boxShadow: '0 0 0 1px #E50914',
            },
            _placeholder: {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          },
        },
      },
    },
    Tabs: {
      variants: {
        netflix: {
          tab: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '600',
            fontSize: '18px',
            _selected: {
              color: 'white',
              borderBottom: '3px solid',
              borderColor: 'netflix.500',
            },
            _hover: {
              color: 'white',
            },
          },
          tablist: {
            borderBottom: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
  },
})

export default netflixTheme

