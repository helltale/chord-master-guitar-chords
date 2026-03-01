import { useState, useEffect, useCallback } from 'react'
import { listArtists as listArtistsApi } from '@/api/client'
import type { Artist } from '@/api/schemas'

export function useListArtists(params?: { limit?: number; offset?: number }) {
  const [items, setItems] = useState<Artist[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const limit = params?.limit
  const offset = params?.offset
  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    listArtistsApi({ limit, offset })
      .then((res) => {
        setItems(res.items ?? [])
        setTotal(res.total ?? 0)
      })
      .catch((e) => {
        setError(e)
        setItems([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [limit, offset])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { items, total, loading, error, refetch }
}
