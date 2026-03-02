import { useState } from 'react'
import type { CreateSongRequest, TabContent } from '@/api/schemas'
import type { Artist } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'
import { LyricsWysiwygEditor } from '@/components/LyricsWysiwygEditor'
import { isContentEmpty } from '@/utils/tabContent'
import { slugFromString } from '@/utils/slug'

interface CreateSongFormProps {
  artists: Artist[]
  artistsLoading: boolean
  onSubmit: (body: CreateSongRequest) => void
  loading: boolean
  error: Error | null
}

const emptyContent: TabContent = {
  sections: [{ type: 'verse', label: '', blocks: [{ kind: 'lyrics', segments: [{ chord: '', text: '' }] }] }],
}

export function CreateSongForm({
  artists,
  artistsLoading,
  onSubmit,
  loading,
  error,
}: CreateSongFormProps) {
  const { t } = useTranslation()
  const [content, setContent] = useState<TabContent>(emptyContent)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const artist_id = (form.elements.namedItem('artist_id') as HTMLSelectElement).value
    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim()
    const slug = (form.elements.namedItem('slug') as HTMLInputElement).value.trim()
    const tonalityRaw = (form.elements.namedItem('tonality') as HTMLInputElement).value
    if (!artist_id || !title || !slug) return
    const tonality = tonalityRaw ? parseInt(tonalityRaw, 10) : undefined
    const contentToSend = isContentEmpty(content) ? undefined : content
    onSubmit({ artist_id, title, slug, tonality, content: contentToSend })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
          {error.message}
        </p>
      )}
      <div>
        <label htmlFor="song-artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('createSong.artist')}
        </label>
        <select
          id="song-artist"
          name="artist_id"
          required
          disabled={artistsLoading}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">{t('createSong.selectArtist')}</option>
          {artists.map((a) => (
            <option key={a.artist_id} value={a.artist_id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="song-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('createSong.songTitle')}
        </label>
        <input
          id="song-title"
          name="title"
          type="text"
          required
          onChange={handleTitleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="song-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('createSong.slug')}
        </label>
        <input
          id="song-slug"
          name="slug"
          type="text"
          required
          onBlur={markSlugTouched}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="song-tonality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('createSong.tonalityOptional')}
        </label>
        <input
          id="song-tonality"
          name="tonality"
          type="number"
          step={1}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label id="song-content-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('createSong.lyricsOptional')}
        </label>
        <LyricsWysiwygEditor
          value={content}
          onChange={setContent}
        />
      </div>
      <button
        type="submit"
        disabled={loading || artistsLoading}
        className="rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? t('createSong.submitting') : t('createSong.submit')}
      </button>
    </form>
  )
}
