import { useState, useCallback } from 'react'
import { transposeSong as transposeSongApi } from '@/api/client'
import type { Song } from '@/api/schemas'

export function useTransposeSong(songId: string | undefined) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const transpose = useCallback(
    async (semitones: number): Promise<Song | null> => {
      if (!songId) return null
      setLoading(true)
      setError(null)
      try {
        const song = await transposeSongApi(songId, semitones)
        return song
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
        return null
      } finally {
        setLoading(false)
      }
    },
    [songId]
  )

  return { transpose, loading, error }
}
