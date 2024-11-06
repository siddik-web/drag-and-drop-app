import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CertificateProvider } from './context/CertificateProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CertificateProvider>
      <App />
    </CertificateProvider>
  </StrictMode>,
)
