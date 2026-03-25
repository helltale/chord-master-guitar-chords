import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { getTheme, setTheme as setThemeCookie, type Theme } from '@/utils/themeCookie'
import { ThemeContext } from './context'

const THEME_TRANSITION_CLASS = 'theme-transition-active'
/** Slightly longer than CSS --theme-crossfade-duration so removal happens after paints settle. */
const THEME_TRANSITION_HOLD_MS = 420

let transitionEndTimer: ReturnType<typeof window.setTimeout> | undefined

function applyThemeToDom(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function scheduleEndThemeTransition() {
  if (transitionEndTimer !== undefined) {
    window.clearTimeout(transitionEndTimer)
  }
  transitionEndTimer = window.setTimeout(() => {
    transitionEndTimer = undefined
    document.documentElement.classList.remove(THEME_TRANSITION_CLASS)
  }, THEME_TRANSITION_HOLD_MS)
}

function applyThemeToDomAnimated(userInitiated: boolean, theme: Theme) {
  const root = document.documentElement
  if (!userInitiated) {
    applyThemeToDom(theme)
    return
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyThemeToDom(theme)
    return
  }
  root.classList.add(THEME_TRANSITION_CLASS)
  applyThemeToDom(theme)
  scheduleEndThemeTransition()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = getTheme()
    applyThemeToDom(t)
    return t
  })

  const setTheme = useCallback((next: Theme) => {
    setThemeCookie(next)
    applyThemeToDomAnimated(true, next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      setThemeCookie(next)
      applyThemeToDomAnimated(true, next)
      return next
    })
  }, [])

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
