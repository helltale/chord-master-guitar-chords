import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/I18nContext'
import { useCreateArtist } from '@/hooks'
import { CreateArtistForm } from '@/components/CreateArtistForm'

export function CreateArtistPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { submit, loading, error } = useCreateArtist()

  const handleSubmit = async (body: { name: string; slug: string }) => {
    const artist = await submit(body)
    if (artist) {
      navigate(`/artist/${artist.slug}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            {t('createArtist.title')}
          </h1>
          <CreateArtistForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}
