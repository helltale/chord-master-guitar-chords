import { useState } from 'react'
import { useSearch, useListSongs } from '@/hooks'
import { SearchBar } from '@/components/SearchBar'
import { HomeCompactSongCard } from '@/components/HomeCompactSongCard'
import { MouseReactiveBackground } from '@/components/MouseReactiveBackground'
import { useTranslation } from '@/contexts/I18nContext'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { artists, songs, totalArtists, totalSongs, total, loading, error } = useSearch(query)
  const {
    items: recentSongs,
    loading: recentLoading,
    error: recentError,
  } = useListSongs({ limit: 5, sort: 'created_at_desc' })
  const {
    items: trendingSongs,
    loading: trendingLoading,
    error: trendingError,
  } = useListSongs({ limit: 5, sort: 'opens_30d_desc' })
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-0 flex-1 flex-col -mx-4 -my-6 overflow-hidden bg-slate-100 px-4 py-6 dark:bg-slate-950">
      <MouseReactiveBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-7">
        <section className="mt-2 text-center md:mt-6 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            ChordMaster
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
            <span className="block">
              {t('home.heroTitleLine1', 'Every chord, every note.')}
            </span>
            <span className="mt-1 block text-indigo-600 dark:text-indigo-300">
              {t('home.heroTitleLine2', 'Master your favorite songs.')}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400 md:text-base">
            {t(
              'home.heroSubtitle',
              'Search artists, songs and tabs. Save time parsing chords – focus on playing.'
            )}
          </p>
        </section>

        <section className="flex flex-1 flex-col gap-8 pb-2">
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
            <div className="hidden gap-6 text-sm text-slate-600 dark:text-slate-400 md:grid md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
              <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_14px_48px_rgba(15,23,42,0.08)] ring-1 ring-inset ring-indigo-500/[0.07] dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-none dark:ring-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                  {t('home.trendingTitle', 'Trending songs')}
                </p>
                <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-500">
                  {t('home.trendingSubtitle', 'Most opened in the last 30 days.')}
                </p>
                {trendingLoading && (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
                )}
                {!trendingLoading && trendingError && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                    {trendingError.message}
                  </p>
                )}
                {!trendingLoading && !trendingError && trendingSongs.length === 0 && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {t('home.trendingEmpty')}
                  </p>
                )}
                {!trendingLoading && !trendingError && trendingSongs.length > 0 && (
                  <ul className="mt-4 grid grid-cols-5 gap-2" role="list">
                    {trendingSongs.map((song) => (
                      <li key={song.song_id} className="min-w-0">
                        <HomeCompactSongCard song={song} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {t('home.recentlyAddedTitle', 'Recently added')}
                </p>
                {recentLoading && (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
                )}
                {!recentLoading && recentError && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                    {recentError.message}
                  </p>
                )}
                {!recentLoading && !recentError && recentSongs.length === 0 && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {t('home.recentlyAddedEmpty')}
                  </p>
                )}
                {!recentLoading && !recentError && recentSongs.length > 0 && (
                  <ul className="mt-4 grid grid-cols-5 gap-2" role="list">
                    {recentSongs.map((song) => (
                      <li key={song.song_id} className="min-w-0">
                        <HomeCompactSongCard song={song} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
