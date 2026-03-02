import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('common.backToHome')}
        </Link>
      </div>
    )
  }

  const content = song.content
  const chordTabs = content?.chord_tabs ?? {}

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{song.title}</h1>
          {song.tonality != null && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('song.tonality')}: {song.tonality}</p>
          )}
        </div>
        <TransposeControl
          onTranspose={handleTranspose}
          loading={transposeLoading}
        />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
        <div>
          {content?.sections && content.sections.length > 0 ? (
            <SongContent content={content} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">{t('common.noContent')}</p>
          )}
        </div>
        <div>
          <ChordFingeringPanel chordTabs={chordTabs} />
        </div>
      </div>
    </div>
  )
}
