import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { getTheme, setTheme as setThemeCookie, type Theme } from '@/utils/themeCookie'
import { ThemeContext } from './context'

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = getTheme()
    applyThemeToDom(t)
    return t
  })

  const setTheme = useCallback((next: Theme) => {
    setThemeCookie(next)
    applyThemeToDom(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
