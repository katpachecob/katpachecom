import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { Home } from './pages/Home'
import { Lab } from './pages/Lab'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab" element={<Lab />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
