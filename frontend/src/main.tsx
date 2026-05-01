import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.body.style.background = `url('${import.meta.env.BASE_URL}wallpaper.png') center / cover no-repeat fixed`

function scaleRoot() {
  const scale = window.innerHeight / 1080
  document.getElementById('root')!.style.transform = `scale(${scale})`
}
scaleRoot()
window.addEventListener('resize', scaleRoot)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
