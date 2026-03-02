import { useNavigate, Link } from 'react-router-dom'
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('createArtist.title')}</h1>
      <CreateArtistForm onSubmit={handleSubmit} loading={loading} error={error} />
      <p className="mt-4">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('common.backToHome')}
        </Link>
      </p>
    </div>
  )
}
