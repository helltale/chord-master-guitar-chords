import { createContext } from 'react'
import type { LocaleKey } from '@/locales/keys'

export type Locale = 'ru' | 'en'

export interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: (key: LocaleKey) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
