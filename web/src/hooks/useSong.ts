import { useState, useEffect, useCallback } from 'react'
import { getSong as getSongApi } from '@/api/client'
import type { Song } from '@/api/schemas'

export function useSong(songId: string | undefined) {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(() => {
    if (!songId) {
      setSong(null)
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    getSongApi(songId)
      .then(setSong)
      .catch((e) => {
        setError(e)
        setSong(null)
      })
      .finally(() => setLoading(false))
  }, [songId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { song, loading, error, refetch }
}
