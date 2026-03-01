import { useState, useCallback } from 'react'
import { createSong } from '@/api/client'
import type { CreateSongRequest } from '@/api/schemas'
import type { Song } from '@/api/schemas'

export function useCreateSong() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = useCallback(
    async (body: CreateSongRequest): Promise<Song | null> => {
      setLoading(true)
      setError(null)
      try {
        const song = await createSong(body)
        return song
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)))
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { submit, loading, error }
}
