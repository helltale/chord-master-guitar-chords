import { Link } from 'react-router-dom'
import type { Artist, SongListItem } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'
import { SongCard } from './SongCard'

interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  artists: Artist[]
  songs: SongListItem[]
  totalArtists: number
  totalSongs: number
  total: number
  loading: boolean
  error: Error | null
}

export function SearchBar({
  query,
  onQueryChange,
  artists,
  songs,
  totalArtists,
  totalSongs,
  total,
  loading,
  error,
}: SearchBarProps) {
  const { t } = useTranslation()
  const hasResults = artists.length > 0 || songs.length > 0
  const topArtist = artists[0]
  const topSong = songs[0]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-700 p-[1px] shadow-[0_20px_56px_rgba(79,70,229,0.22)] transition-[box-shadow] duration-300 dark:from-indigo-600 dark:via-indigo-900/80 dark:to-slate-950 dark:shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
        <div className="rounded-3xl bg-white/95 px-4 py-4 transition-[background-color] duration-300 dark:bg-slate-950/95 sm:px-6 sm:py-6">
          <label htmlFor="search" className="sr-only">
            {t('search.label')}
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-100/90 px-4 py-3 ring-1 ring-slate-300/80 transition-[background-color,box-shadow] duration-300 focus-within:ring-2 focus-within:ring-indigo-500 dark:bg-slate-900/90 dark:ring-slate-700/70 dark:focus-within:ring-indigo-400">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                🔍
              </span>
              <input
                id="search"
                type="search"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 outline-none dark:text-slate-50"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 transition-colors duration-300 dark:text-slate-500">
              <span>
                {query.trim()
                  ? `${t('common.found')}: ${total}`
                  : t('search.helper', 'Type artist, song or chord name to start.')}
              </span>
              {query.trim() && hasResults && (
                <span className="hidden text-indigo-600 sm:inline dark:text-indigo-300">
                  {t('search.topMatches', 'Top matches below')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading && (
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {t('common.error')}: {error.message}
          </p>
        )}
        {!loading && !error && query.trim() && (
          <>
            {!hasResults ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('common.nothingFound')}
              </p>
            ) : (
              <div className="space-y-8">
                {(topArtist || topSong) && (
                  <section>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                      {t('home.topResultsTitle', 'Top match')}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {topArtist && (
                        <Link
                          to={`/artist/${topArtist.slug}`}
                          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-md shadow-slate-900/5 transition-[border-color,background-color,box-shadow] duration-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:shadow-black/50 dark:hover:bg-slate-900/90"
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                              {t('search.artists')}
                            </p>
                            <p className="mt-1 text-sm font-medium">{topArtist.name}</p>
                          </div>
                          <span className="text-xs text-indigo-600 group-hover:translate-x-0.5 dark:text-indigo-300">
                            {t('common.view', 'Open')} →
                          </span>
                        </Link>
                      )}
                      {topSong && (
                        <SongCard item={topSong} />
                      )}
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                    <span>
                      {t('search.artists')} ({totalArtists})
                    </span>
                  </div>
                  {artists.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-500">
                      {t('search.noArtists', 'No artists for this query yet.')}
                    </p>
                  ) : (
                    <ul className="grid gap-2 sm:grid-cols-2" role="list">
                      {artists.map((artist) => (
                        <li key={artist.artist_id}>
                          <Link
                            to={`/artist/${artist.slug}`}
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm shadow-slate-900/5 transition-[border-color,background-color] duration-200 hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:shadow-black/40 dark:hover:bg-slate-900/90"
                          >
                            <span className="font-medium">{artist.name}</span>
                            <span className="text-xs text-slate-500 group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                    <span>
                      {t('search.songs')} ({totalSongs})
                    </span>
                  </div>
                  {songs.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-500">
                      {t('search.noSongs', 'No songs for this query yet.')}
                    </p>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
                      {songs.map((item) => (
                        <li key={item.song_id}>
                          <SongCard item={item} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
