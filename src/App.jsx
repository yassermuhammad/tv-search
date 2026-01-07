import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  // Get base path from window location for GitHub Pages
  const basePath = import.meta.env.BASE_URL || '/'
  
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

