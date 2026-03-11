import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/I18nContext'
import type { TabContent } from '@/api/schemas'
import { useCreateSong, useListArtists } from '@/hooks'
import { CreateSongForm } from '@/components/CreateSongForm'
import { SongContent } from '@/components/SongContent'

export function CreateSongPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { submit, loading, error } = useCreateSong()
  const { items: artists, loading: artistsLoading } = useListArtists({ limit: 500 })
  const [searchParams] = useSearchParams()
  const defaultArtistId = searchParams.get('artist_id') ?? undefined
  const [preview, setPreview] = useState<{
    title: string
    artistName: string
    tonality?: number
    content: TabContent | null
  } | null>(null)

  const handleSubmit = async (body: Parameters<typeof submit>[0]) => {
    const song = await submit(body)
    if (song) {
      navigate(`/song/${song.song_id}`)
    }
  }

  return (
    <div className="flex flex-1 flex-col px-4 py-6 md:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
        {/* Header / description */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            SongCraft Editor
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            {t('createSong.title')}
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            {t(
              'createSong.subtitle',
              'Set artist, title and key, then craft lyrics with chords in the editor below.'
            )}
          </p>
        </div>

        {/* Two-column workspace */}
        <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-[0_26px_70px_rgba(15,23,42,0.9)] md:flex-row md:p-6 lg:gap-8">
          {/* Left: form + editor */}
          <div className="flex-1 border-b border-slate-800 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <CreateSongForm
              artists={artists}
              artistsLoading={artistsLoading}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              defaultArtistId={defaultArtistId}
              onPreviewChange={setPreview}
            />
          </div>

          {/* Right: live preview */}
          <aside className="mt-4 flex flex-1 flex-col gap-4 md:mt-0 md:pl-2">
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {t('createSong.previewTitle')}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                {t('createSong.previewText')}
              </p>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              {preview && preview.content ? (
                <div className="flex h-full flex-col gap-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-semibold text-slate-50">
                      {preview.title}
                    </h3>
                    {preview.artistName && (
                      <p className="text-xs text-slate-400">
                        {preview.artistName}
                      </p>
                    )}
                    {typeof preview.tonality === 'number' && (
                      <p className="mt-1 inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-slate-400">
                        {t('song.tonality')}: {preview.tonality}
                      </p>
                    )}
                  </div>
                  <div className="custom-scrollbar flex-1 overflow-y-auto pr-1 text-sm">
                    <SongContent content={preview.content} />
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-xs text-slate-500">
                  <p>{t('createSong.statusDraft')}</p>
                  <p className="mt-1 text-[11px]">
                    {t('createSong.tipSyntax')}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
