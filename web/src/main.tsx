import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { I18nProvider } from '@/contexts/I18nContext'
import { FollowsProvider } from '@/contexts/follows'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <FollowsProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </FollowsProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
