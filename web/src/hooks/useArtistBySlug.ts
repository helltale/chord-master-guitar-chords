import { useState, useEffect, useCallback } from 'react'
import { getArtistBySlug as getArtistApi } from '@/api/client'
import type { ArtistWithSongs } from '@/api/schemas'

export function useArtistBySlug(artistSlug: string | undefined) {
  const [artist, setArtist] = useState<ArtistWithSongs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(() => {
    if (!artistSlug) {
      setArtist(null)
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    getArtistApi(artistSlug)
      .then(setArtist)
      .catch((e) => {
        setError(e)
        setArtist(null)
      })
      .finally(() => setLoading(false))
  }, [artistSlug])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { artist, loading, error, refetch }
}
