import type { CreateArtistRequest } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'
import { slugFromString } from '@/utils/slug'

interface CreateArtistFormProps {
  onSubmit: (body: CreateArtistRequest) => void
  loading: boolean
  error: Error | null
}

export function CreateArtistForm({
  onSubmit,
  loading,
  error,
}: CreateArtistFormProps) {
  const { t } = useTranslation()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const slug = (form.elements.namedItem('slug') as HTMLInputElement).value.trim()
    if (!name || !slug) return
    onSubmit({ name, slug })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.target.form
    if (!form) return
    const slugField = form.elements.namedItem('slug') as HTMLInputElement
    if (slugField && !slugField.dataset.touched) return
    const slug = slugFromString(e.target.value)
    if (slug) slugField.value = slug
  }

  const markSlugTouched = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.dataset.touched = '1'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
          {error.message}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="artist-name"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createArtist.name')}
        </label>
        <input
          id="artist-name"
          name="name"
          type="text"
          required
          onChange={handleNameChange}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="artist-slug"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createArtist.slug')}
        </label>
        <input
          id="artist-slug"
          name="slug"
          type="text"
          required
          onBlur={markSlugTouched}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(79,70,229,0.6)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t('createArtist.submitting') : t('createArtist.submit')}
      </button>
    </form>
  )
}
