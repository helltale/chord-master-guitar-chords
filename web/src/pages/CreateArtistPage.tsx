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
    <div className="flex flex-1 flex-col px-4 py-6 md:py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {/* Back link and title */}
        <div className="mb-8 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-sm">
              ←
            </span>
            <span className="uppercase tracking-[0.16em]">
              {t('common.backToHome')}
            </span>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
              {t('createArtist.title')}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              {t(
                'createArtist.subtitle',
                'Add a new artist profile to your chord library. Name and slug will define how the artist appears and is linked.'
              )}
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.9)] md:p-10">
          <CreateArtistForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>

        {/* Helper section */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="mt-1 h-8 w-8 rounded-full bg-indigo-500/20 text-center text-indigo-300">
              <span className="text-sm leading-8">ⓘ</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                {t('createArtist.tipSyncTitle', 'Automatic sync')}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t(
                  'createArtist.tipSyncText',
                  'Artist data automatically links to all its songs so updates in one place stay consistent.'
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mt-1 h-8 w-8 rounded-full bg-slate-800 text-center text-slate-300">
              <span className="text-sm leading-8">★</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                {t('createArtist.tipSlugTitle', 'Clean URLs')}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t(
                  'createArtist.tipSlugText',
                  'Slug is used in links like /artist/my-artist. Keep it short, lowercase and without spaces.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
