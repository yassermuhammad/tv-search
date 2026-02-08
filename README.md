# TV Show Search - TVMaze Integration

A modern React application for searching TV shows and series using the [TVMaze API](https://www.tvmaze.com/api). Built with React, Chakra UI, and Vite.

## Features

- 🔍 **Search TV Shows**: Search for shows by name with real-time results
- 🎨 **Modern UI**: Beautiful interface built with Chakra UI
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Built with Vite for optimal performance
- 🎯 **Debounced Search**: Efficient search with 500ms debounce

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
movie-search/
├── src/
│   ├── components/
│   │   └── ShowCard.jsx      # Component for displaying show cards
│   ├── pages/
│   │   └── Home.jsx          # Home page with search functionality
│   ├── services/
│   │   └── tvmazeApi.js      # API service for TVMaze integration
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## API Integration

This app uses the [TVMaze API](https://www.tvmaze.com/api) which provides:
- Free, fast, and clean REST API
- JSON responses
- CORS enabled
- Rate limited to 20 calls per 10 seconds per IP

### Endpoints Used

- `GET /search/shows?q=:query` - Search for shows by name

## Technologies Used

- **React 18** - UI library
- **Chakra UI** - Component library
- **React Router** - Routing
- **Vite** - Build tool and dev server
- **TVMaze API** - TV show data source

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production (generates icons automatically)
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn generate-icons` - Generate PWA icons from SVG

## PWA (Progressive Web App) Support

This app is a Progressive Web App (PWA) that can be installed on your phone or desktop:

### Features:
- ✅ Installable on mobile and desktop
- ✅ Offline support with service worker
- ✅ App icons for home screen
- ✅ Caching for better performance
- ✅ Works offline (cached API responses)

### How to Install:

**On Mobile (iOS/Android):**
1. Open the app in your browser
2. Look for "Add to Home Screen" or "Install" prompt
3. Or use browser menu → "Add to Home Screen"

**On Desktop:**
1. Look for the install icon in your browser's address bar
2. Click to install the app

### Icons:
Icons are automatically generated from `public/icon.svg` when you run `yarn build` or `yarn generate-icons`.

## License

This project uses data from TVMaze API, licensed under CC BY-SA.


