import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { ConceptsPage } from '@/pages/ConceptsPage'
import { LandingPage } from '@/pages/LandingPage'
import { LearnPage } from '@/pages/LearnPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LandingPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="concepts" element={<ConceptsPage />} />
      </Route>
    </Routes>
  )
}
