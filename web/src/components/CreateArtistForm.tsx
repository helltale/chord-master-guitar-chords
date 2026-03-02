import type { CreateArtistRequest } from '@/api/schemas'
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
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
          {error.message}
        </p>
      )}
      <div>
        <label htmlFor="artist-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Имя
        </label>
        <input
          id="artist-name"
          name="name"
          type="text"
          required
          onChange={handleNameChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="artist-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Slug
        </label>
        <input
          id="artist-slug"
          name="slug"
          type="text"
          required
          onBlur={markSlugTouched}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? 'Создание...' : 'Создать артиста'}
      </button>
    </form>
  )
}
