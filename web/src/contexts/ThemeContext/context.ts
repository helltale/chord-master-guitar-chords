import { createContext } from 'react'
import type { Theme } from '@/utils/themeCookie'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (next: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
