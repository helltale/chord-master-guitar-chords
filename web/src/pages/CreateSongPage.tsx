import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/I18nContext'
import { useCreateSong, useListArtists } from '@/hooks'
import { CreateSongForm } from '@/components/CreateSongForm'

export function CreateSongPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { submit, loading, error } = useCreateSong()
  const { items: artists, loading: artistsLoading } = useListArtists({ limit: 500 })

  const handleSubmit = async (body: Parameters<typeof submit>[0]) => {
    const song = await submit(body)
    if (song) {
      navigate(`/song/${song.song_id}`)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('createSong.title')}</h1>
      <CreateSongForm
        artists={artists}
        artistsLoading={artistsLoading}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      <p className="mt-4">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('common.backToHome')}
        </Link>
      </p>
    </div>
  )
}
