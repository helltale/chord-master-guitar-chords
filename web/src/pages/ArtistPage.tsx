import { useParams, Link } from 'react-router-dom'
import { useArtistBySlug } from '@/hooks'
import { SongCard } from '@/components/SongCard'

export function ArtistPage() {
  const { artistSlug } = useParams<{ artistSlug: string }>()
  const { artist, loading, error } = useArtistBySlug(artistSlug)

  if (loading && !artist) {
    return (
      <div className="py-8 text-gray-500 dark:text-gray-400">
        Загрузка...
      </div>
    )
  }
  if (error || !artist) {
    return (
      <div className="py-8">
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error ? error.message : 'Артист не найден'}
        </p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          На главную
        </Link>
      </div>
    )
  }

  const songs = artist.songs ?? []

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{artist.name}</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">slug: {artist.slug}</p>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Песни</h2>
      {songs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Нет песен</p>
      ) : (
        <ul className="space-y-2" role="list">
          {songs.map((item) => (
            <li key={item.song_id}>
              <SongCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
