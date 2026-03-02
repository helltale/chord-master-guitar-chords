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
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="search" className="sr-only">
        {t('search.label')}
      </label>
      <input
        id="search"
        type="search"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoFocus
      />
      <div className="mt-4">
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('common.loading')}</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
            {t('common.error')}: {error.message}
          </p>
        )}
        {!loading && !error && query.trim() && (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {t('common.found')}: {total}
            </p>
            {!hasResults ? (
              <p className="text-gray-500 dark:text-gray-400">{t('common.nothingFound')}</p>
            ) : (
              <div className="space-y-6">
                {artists.length > 0 && (
                  <section>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                      {t('search.artistFoundForQuery').replace('{query}', query.trim())}
                    </p>
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('search.artists')} ({totalArtists})
                    </h2>
                    <ul className="space-y-2" role="list">
                      {artists.map((artist) => (
                        <li key={artist.artist_id}>
                          <Link
                            to={`/artist/${artist.slug}`}
                            className="block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition font-medium text-gray-900 dark:text-gray-100"
                          >
                            {artist.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {songs.length > 0 && (
                  <section>
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('search.songs')} ({totalSongs})
                    </h2>
                    <ul className="space-y-2" role="list">
                      {songs.map((item) => (
                        <li key={item.song_id}>
                          <SongCard item={item} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
