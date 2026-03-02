import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LocaleKey } from '@/locales/keys'
import { ru } from '@/locales/ru'
import { en } from '@/locales/en'
import { I18nContext } from './context'
import type { Locale } from './context'

const STORAGE_KEY = 'locale'

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

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
