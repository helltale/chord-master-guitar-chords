const COOKIE_NAME = 'theme'
const MAX_AGE_YEAR = 31536000

export type Theme = 'dark' | 'light'

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const m = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  const value = m ? m[1].trim() : ''
  return value === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${MAX_AGE_YEAR}; SameSite=Lax`
}
