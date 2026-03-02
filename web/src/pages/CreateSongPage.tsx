import { useNavigate } from 'react-router-dom'
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
    <div className="flex-1 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            {t('createSong.title')}
          </h1>
          <CreateSongForm
            artists={artists}
            artistsLoading={artistsLoading}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
