import { useState, useEffect, useCallback } from 'react'
import { listSongs as listSongsApi } from '@/api/client'
import type { SongListItem } from '@/api/schemas'

export function useListSongs(params?: {
  artist_id?: string
  limit?: number
  offset?: number
  sort?: 'title' | 'created_at_desc'
}) {
  const [items, setItems] = useState<SongListItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const artistId = params?.artist_id
  const limit = params?.limit
  const offset = params?.offset
  const sort = params?.sort

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    listSongsApi({ artist_id: artistId, limit, offset, sort })
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
  }, [artistId, limit, offset, sort])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { items, total, loading, error, refetch }
}

