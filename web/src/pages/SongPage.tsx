import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSong, useTransposeSong } from '@/hooks'
import { useTranslation } from '@/contexts/I18nContext'
import { SongContent } from '@/components/SongContent'
import { ChordFingeringPanel } from '@/components/ChordFingeringPanel'
import { TransposeControl } from '@/components/TransposeControl'
import type { Song } from '@/api/schemas'

export function SongPage() {
  const { songId } = useParams<{ songId: string }>()
  const { t } = useTranslation()
  const { song: fetchedSong, loading, error } = useSong(songId)
  const { transpose, loading: transposeLoading } = useTransposeSong(songId)
  const [song, setSong] = useState<Song | null>(null)

  useEffect(() => {
    setSong(fetchedSong)
  }, [fetchedSong])

  const handleTranspose = async (semitones: number) => {
    const updated = await transpose(semitones)
    if (updated) setSong(updated)
  }

  if (loading && !song) {
    return (
      <div className="py-8 text-gray-500 dark:text-gray-400">
        {t('common.loading')}
      </div>
    )
  }
  if (error || !song) {
    return (
      <div className="py-8">
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error ? error.message : t('common.songNotFound')}
        </p>
      </div>
    )
  }

  const content = song.content
  const chordTabs = content?.chord_tabs ?? {}

  return (
    <div className="flex h-full min-h-0 flex-col -mx-4 -my-6 px-4 py-4 bg-gray-50 dark:bg-gray-950">
      {/* Sticky in-page header with song info and quick actions */}
      <header className="z-10 mb-4 flex items-center justify-between gap-4 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
            <span className="text-lg font-semibold">♫</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              {song.title}
            </h1>
            {song.tonality != null && (
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {t('song.tonality')}: {song.tonality}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('common.favorite') ?? 'Favorite'}
          >
            <span className="text-base">★</span>
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('common.share') ?? 'Share'}
          >
            <span className="text-base">⇢</span>
          </button>
          <div className="hidden md:inline-flex">
            <TransposeControl onTranspose={handleTranspose} loading={transposeLoading} />
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left sidebar: transpose (mobile) + chord panel */}
        <aside className="hidden w-72 flex-none flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200/70 bg-white/80 p-4 shadow-sm custom-scrollbar dark:border-gray-800 dark:bg-gray-900/80 lg:flex">
          <div className="mb-2 block md:hidden">
            <TransposeControl onTranspose={handleTranspose} loading={transposeLoading} />
          </div>
          <ChordFingeringPanel chordTabs={chordTabs} />
        </aside>

        {/* Main scrollable lyrics/chords area */}
        <main className="custom-scrollbar flex-1 overflow-y-auto rounded-xl border border-gray-200/70 bg-white/90 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 md:p-8">
          <div className="mx-auto max-w-3xl">
            {content?.sections && content.sections.length > 0 ? (
              <SongContent content={content} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{t('common.noContent')}</p>
            )}
          </div>
        </main>
      </div>

      {/* Bottom mini-player (visual only for now) */}
      <footer className="mt-4 flex h-14 items-center justify-between rounded-xl border border-gray-200/70 bg-white/90 px-4 text-xs text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('player.previous') ?? 'Previous song'}
          >
            ‹‹
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-500"
            aria-label={t('player.play') ?? 'Play'}
          >
            ▶
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('player.next') ?? 'Next song'}
          >
            ››
          </button>
        </div>
        <div className="hidden flex-1 items-center gap-2 px-6 md:flex">
          <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">1:24</span>
          <div className="h-1.5 flex-1 rounded-full bg-gray-800/60 dark:bg-gray-700">
            <div className="h-full w-1/4 rounded-full bg-indigo-500" />
          </div>
          <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">5:40</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-base">🔊</span>
            <div className="h-1 w-20 rounded-full bg-gray-800/60 dark:bg-gray-700">
              <div className="h-full w-2/3 rounded-full bg-gray-400 dark:bg-gray-300" />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={t('player.settings') ?? 'Player settings'}
          >
            ⚙
          </button>
        </div>
      </footer>
    </div>
  )
}
