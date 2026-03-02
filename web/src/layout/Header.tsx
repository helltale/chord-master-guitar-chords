import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from '@/contexts/I18nContext'
import type { Locale } from '@/contexts/I18nContext'

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.061l-1.06 1.06a.75.75 0 101.06 1.061l1.06-1.06zM4.343 14.596a.75.75 0 10-1.06-1.061l-1.06 1.06a.75.75 0 101.06 1.061l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM16.596 15.657a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06zM3.404 4.343a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
    </svg>
  )
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { t, locale, setLocale } = useTranslation()

  const themeTitle = theme === 'dark' ? t('header.lightTheme') : t('header.darkTheme')
  const themeAria = theme === 'dark' ? t('header.lightThemeAria') : t('header.darkThemeAria')

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300">
          {t('header.appName')}
        </Link>
        <nav className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {(['ru', 'en'] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`rounded px-2 py-1 text-sm font-medium ${locale === lang ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                aria-pressed={locale === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={themeTitle}
            aria-label={themeAria}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link
            to="/artists/new"
            className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {t('header.createArtist')}
          </Link>
          <Link
            to="/songs/new"
            className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {t('header.createSong')}
          </Link>
        </nav>
      </div>
    </header>
  )
}
