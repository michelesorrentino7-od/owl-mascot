import React from 'react'
import ReactDOM from 'react-dom/client'
import { OwlMascot } from './owl-mascot'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#eee', padding: 40 }}>
      <header data-seat="mast" data-seat-edge="top" style={{ marginBottom: 40 }}>
        <h1>Owl Mascot Demo</h1>
        <p>Move the mouse near the owl — it tracks with the 3×3 sprite sheet.</p>
      </header>
      <article data-seat="card" data-seat-edge="top" style={{ maxWidth: 600, padding: 20, background: '#222', borderRadius: 12 }}>
        <p>This is a seat the owl can perch on. Scroll or move away and it will fly to another seat.</p>
      </article>
      <OwlMascot />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
