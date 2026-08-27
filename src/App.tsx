import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { SmoothScroll } from './components/SmoothScroll'
import { Home } from './pages/Home'

const Lab = lazy(() => import('./pages/Lab').then((m) => ({ default: m.Lab })))
const ProjectDetail = lazy(() =>
  import('./pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
)

function App() {
  return (
    <LanguageProvider>
      <SmoothScroll />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/lab"
            element={
              <Suspense fallback={null}>
                <Lab />
              </Suspense>
            }
          />
          <Route
            path="/portfolio/:slug"
            element={
              <Suspense fallback={null}>
                <ProjectDetail />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
