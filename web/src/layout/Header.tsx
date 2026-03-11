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
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 shadow-[0_10px_40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo + primary navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.9)]">
              <span className="text-lg font-bold">♭</span>
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-slate-50 sm:inline">
              {t('header.appName')}
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-xs font-medium text-slate-400 sm:flex">
            <Link
              to="/artists"
              className="rounded-full px-3 py-1.5 transition hover:bg-slate-900 hover:text-slate-50"
            >
              {t('header.nav.artists')}
            </Link>
            <Link
              to="/songs"
              className="rounded-full px-3 py-1.5 transition hover:bg-slate-900 hover:text-slate-50"
            >
              {t('header.nav.songs')}
            </Link>
            <Link
              to="/favorites"
              className="rounded-full px-3 py-1.5 transition hover:bg-slate-900 hover:text-slate-50"
            >
              {t('header.nav.favorites')}
            </Link>
          </nav>
        </div>

        {/* Locale switcher + actions */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full bg-slate-900/80 p-1 text-[11px] text-slate-300 sm:flex">
            {(['ru', 'en'] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`min-w-[2.25rem] rounded-full px-2 py-0.5 font-semibold ${
                  locale === lang
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
                aria-pressed={locale === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={themeTitle}
            aria-label={themeAria}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/artists/new"
              className="rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:text-white"
            >
              {t('header.createArtist')}
            </Link>
            <Link
              to="/songs/new"
              className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,0.9)] transition hover:bg-indigo-400"
            >
              {t('header.createSong')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
