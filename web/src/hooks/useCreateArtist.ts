import { useState, useCallback } from 'react'
import { createArtist } from '@/api/client'
import type { CreateArtistRequest } from '@/api/schemas'
import type { Artist } from '@/api/schemas'

export function useCreateArtist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = useCallback(
    async (body: CreateArtistRequest): Promise<Artist | null> => {
      setLoading(true)
      setError(null)
      try {
        const artist = await createArtist(body)
        return artist
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
