import { useEffect, useState } from 'react'
import { Board } from './components/Board'
import { ProjectSidebar } from './components/ProjectSidebar'
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() =>
    localStorage.getItem('trellis:selectedProjectId'),
  )

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('trellis:selectedProjectId', selectedProjectId)
    }
  }, [selectedProjectId])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">GraphQL learning app</p>
          <h1>Trellis</h1>
        </div>
        <p className="app-tagline">
          Projects, tasks, and live updates powered by Apollo Server and Apollo Client.
        </p>
      </header>

      <div className="app-layout">
        <ProjectSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <main className="app-main">
          {selectedProjectId ? (
            <Board projectId={selectedProjectId} />
          ) : (
            <section className="board board-empty">
              Select a project to open its Kanban board.
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
