import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { LocaleKey } from '@/locales/keys'
import { ru } from '@/locales/ru'
import { en } from '@/locales/en'

const STORAGE_KEY = 'locale'

export type Locale = 'ru' | 'en'

const dictionaries: Record<Locale, typeof ru> = { ru, en }

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'ru'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ru') return stored
  return 'ru'
}

function setStoredLocale(locale: Locale) {
  localStorage.setItem(STORAGE_KEY, locale)
}

interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: (key: LocaleKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setStoredLocale(next)
    setLocaleState(next)
  }, [])

  const dict = dictionaries[locale]
  const t = useCallback(
    (key: LocaleKey) => dict[key] ?? key,
    [dict]
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}

/**
 * Hook for components that need the translation function and optional locale/setLocale.
 * Re-renders only when locale changes.
 */
export function useTranslation() {
  return useI18n()
}
