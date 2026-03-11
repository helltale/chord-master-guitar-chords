import { useState } from 'react'
import { useSearch } from '@/hooks'
import { SearchBar } from '@/components/SearchBar'
import { MouseReactiveBackground } from '@/components/MouseReactiveBackground'
import { useTranslation } from '@/contexts/I18nContext'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { artists, songs, totalArtists, totalSongs, total, loading, error } = useSearch(query)
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-0 flex-1 flex-col -mx-4 -my-6 overflow-hidden bg-slate-950 px-4 py-8">
      <MouseReactiveBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-10">
        <section className="mt-4 text-center md:mt-8 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            ChordMaster
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            <span className="block">
              {t('home.heroTitleLine1', 'Every chord, every note.')}
            </span>
            <span className="mt-1 block text-indigo-300">
              {t('home.heroTitleLine2', 'Master your favorite songs.')}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-400 md:text-base">
            {t(
              'home.heroSubtitle',
              'Search artists, songs and tabs. Save time parsing chords – focus on playing.'
            )}
          </p>
        </section>

        <section className="flex flex-1 flex-col gap-10 pb-6">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            artists={artists}
            songs={songs}
            totalArtists={totalArtists}
            totalSongs={totalSongs}
            total={total}
            loading={loading}
            error={error}
          />

          {/* Placeholder for future trending / recently added sections */}
          {!query.trim() && !loading && !error && (
            <div className="hidden gap-6 text-sm text-slate-400 md:grid md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
              <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {t('home.trendingTitle', 'Trending songs')}
                </p>
                <p className="mt-2 max-w-md text-slate-400">
                  {t(
                    'home.trendingSubtitle',
                    'Start typing in the search above – we will surface the most relevant artists and songs for you.'
                  )}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {t('home.recentlyAddedTitle', 'Recently added')}
                </p>
                <p className="mt-2 text-slate-400">
                  {t(
                    'home.recentlyAddedSubtitle',
                    'New songs you add will appear here. Use “Create artist” and “Create song” in the header to grow your library.'
                  )}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
