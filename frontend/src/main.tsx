import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function scaleRoot() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
  const root = document.getElementById('root')!
  root.style.transform = `scale(${scale})`
  document.body.style.width = `${1920 * scale}px`
  document.body.style.height = `${1080 * scale}px`
}
scaleRoot()
window.addEventListener('resize', scaleRoot)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
