import { useEffect, useRef, useState } from 'react'
import type { CreateSongRequest, TabContent } from '@/api/schemas'
import type { Artist } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'
import { parseLyricsWithChords } from '@/utils/parseLyricsWithChords'
import { slugFromString } from '@/utils/slug'

interface CreateSongFormProps {
  artists: Artist[]
  artistsLoading: boolean
  onSubmit: (body: CreateSongRequest) => void
  loading: boolean
  error: Error | null
  defaultArtistId?: string
  onPreviewChange?: (preview: {
    title: string
    artistName: string
    tonality?: number
    content: TabContent | null
  } | null) => void
}

const CHORD_PRESETS = ['G', 'C', 'D', 'Em', 'Am', 'F', 'Bm'] as const

export function CreateSongForm({
  artists,
  artistsLoading,
  onSubmit,
  loading,
  error,
  defaultArtistId,
  onPreviewChange,
}: CreateSongFormProps) {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)
  const [artistSearch, setArtistSearch] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<string>('')
  const [lyricsText, setLyricsText] = useState('')
  const [title, setTitle] = useState('')
  const [tonalityRaw, setTonalityRaw] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const slug = (form.elements.namedItem('slug') as HTMLInputElement).value.trim()
    const trimmedTitle = title.trim()
    if (!selectedArtistId || !trimmedTitle || !slug) return
    const tonality = tonalityRaw ? parseInt(tonalityRaw, 10) : undefined
    const contentToSend = lyricsText.trim() ? parseLyricsWithChords(lyricsText) : undefined
    onSubmit({ artist_id: selectedArtistId, title: trimmedTitle, slug, tonality, content: contentToSend })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSlugManualEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.dataset.touched = '1'
  }

  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(artistSearch.toLowerCase())
  )
  const visibleArtists = filteredArtists.slice(0, 8)

  useEffect(() => {
    if (!defaultArtistId || selectedArtistId) return
    const a = artists.find((artist) => artist.artist_id === defaultArtistId)
    if (!a) return
    setSelectedArtistId(defaultArtistId)
    setArtistSearch(a.name)
  }, [defaultArtistId, artists, selectedArtistId])

  useEffect(() => {
    const slugField = formRef.current?.elements.namedItem('slug') as HTMLInputElement | undefined
    if (!slugField || slugField.dataset.touched) return
    const artist = artists.find((a) => a.artist_id === selectedArtistId)
    const parts = [artist?.name?.trim() ?? '', title.trim()].filter(Boolean)
    const slug = slugFromString(parts.join(' '))
    slugField.value = slug
  }, [artists, selectedArtistId, title])

  useEffect(() => {
    if (!onPreviewChange) return
    const artist = artists.find((a) => a.artist_id === selectedArtistId)
    const trimmedTitle = title.trim()
    const hasContent = lyricsText.trim().length > 0
    if (!artist && !trimmedTitle && !hasContent && !tonalityRaw) {
      onPreviewChange(null)
      return
    }
    const content: TabContent | null = hasContent ? parseLyricsWithChords(lyricsText) : null
    const tonality = tonalityRaw ? parseInt(tonalityRaw, 10) : undefined
    onPreviewChange({
      title: trimmedTitle || 'Untitled song',
      artistName: artist?.name ?? '',
      tonality,
      content,
    })
  }, [artists, selectedArtistId, title, lyricsText, tonalityRaw, onPreviewChange])

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
          {error.message}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <label
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createSong.artist')}
        </label>
        <input
          type="search"
          value={artistSearch}
          onChange={(e) => setArtistSearch(e.target.value)}
          disabled={artistsLoading}
          placeholder={t('search.placeholder')}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="mt-2 max-h-36 space-y-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
          {visibleArtists.length === 0 ? (
            <p className="px-2 py-1 text-xs text-slate-500">
              {t('search.noArtists')}
            </p>
          ) : (
            visibleArtists.map((a) => (
              <button
                key={a.artist_id}
                type="button"
                onClick={() => setSelectedArtistId(a.artist_id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs ${
                  selectedArtistId === a.artist_id
                    ? 'bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-400'
                    : 'bg-transparent text-slate-200 hover:bg-slate-900'
                }`}
                aria-pressed={selectedArtistId === a.artist_id}
              >
                <span className="font-medium">{a.name}</span>
                {selectedArtistId === a.artist_id && (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-indigo-300">
                    selected
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="song-title"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createSong.songTitle')}
        </label>
        <input
          id="song-title"
          name="title"
          type="text"
          required
          onChange={handleTitleChange}
          value={title}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="song-slug"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createSong.slug')}
        </label>
        <input
          id="song-slug"
          name="slug"
          type="text"
          required
          onChange={handleSlugManualEdit}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="song-tonality"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createSong.tonalityOptional')}
        </label>
        <input
          id="song-tonality"
          name="tonality"
          type="number"
          step={1}
          value={tonalityRaw}
          onChange={(e) => setTonalityRaw(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-50 shadow-sm shadow-black/30 outline-none ring-1 ring-slate-900/60 focus:border-indigo-400 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label
          id="song-content-label"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {t('createSong.lyricsOptional')}
        </label>
        <textarea
          aria-labelledby="song-content-label"
          value={lyricsText}
          onChange={(e) => setLyricsText(e.target.value)}
          rows={8}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-100 shadow-inner shadow-black/40 outline-none ring-1 ring-slate-900/80 focus:border-indigo-400 focus:ring-indigo-500"
          placeholder="[Am] Thoughts fly away, [Dm] stretch [F] beyond the horizon..."
        />
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {t(
                'createSong.tipSyntax',
                'Use [Am] inside plain text to place chords above words when parsed.'
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHORD_PRESETS.map((chord) => (
              <button
                key={chord}
                type="button"
                onClick={() => setLyricsText((prev) => `${prev}${prev ? ' ' : ''}[${chord}] `)}
                className="flex h-8 min-w-[2.5rem] items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500 hover:text-white"
              >
                {chord}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || artistsLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(79,70,229,0.6)] transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t('createSong.submitting') : t('createSong.submit')}
      </button>
    </form>
  )
}
