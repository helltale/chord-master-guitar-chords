import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/I18nContext'
import { useCreateArtist } from '@/hooks'
import { CreateArtistForm } from '@/components/CreateArtistForm'
import type { CreateArtistRequest } from '@/api/schemas'

export function CreateArtistPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { submit, loading, error } = useCreateArtist()

  const handleSubmit = async (body: CreateArtistRequest) => {
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
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/90 text-sm dark:bg-slate-900/80">
              ←
            </span>
            <span className="uppercase tracking-[0.16em]">
              {t('common.backToHome')}
            </span>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {t('createArtist.title')}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              {t(
                'createArtist.subtitle',
                'Add a new artist profile to your chord library. The display name defines how the artist appears in your collection.'
              )}
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_52px_rgba(15,23,42,0.08)] transition-[border-color,background-color,box-shadow] duration-300 md:p-10 dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-[0_24px_60px_rgba(15,23,42,0.9)]">
          <CreateArtistForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>

        {/* Helper section */}
        <div className="mt-8">
          <div className="flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 md:max-w-2xl">
            <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 text-center text-indigo-600 dark:text-indigo-300">
              <span className="text-sm leading-8">ⓘ</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {t('createArtist.tipSyncTitle', 'Automatic sync')}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t(
                  'createArtist.tipSyncText',
                  'Artist data automatically links to all its songs so updates in one place stay consistent.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
