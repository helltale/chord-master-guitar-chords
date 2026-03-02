import { useContext } from 'react'
import { I18nContext } from './context'

export function useI18n() {
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
