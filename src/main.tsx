import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Suppress Cross-Origin-Opener-Policy warnings from Firebase Auth popup
const originalError = console.error
console.error = (...args: any[]) => {
  const msg = args[0]?.toString?.() || ''
  if (msg.includes('Cross-Origin-Opener-Policy')) return
  originalError.apply(console, args)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
