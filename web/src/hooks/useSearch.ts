import { useState, useEffect, useCallback } from 'react'
import { search as searchApi } from '@/api/client'
import type { SongListItem } from '@/api/schemas'

const DEBOUNCE_MS = 300

export function useSearch(query: string, limit = 20) {
  const [items, setItems] = useState<SongListItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setItems([])
      setTotal(0)
      setError(null)
      return
    }
    const t = setTimeout(() => {
      setLoading(true)
      setError(null)
      searchApi({ q: query.trim(), limit })
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
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query, limit])

  const refetch = useCallback(() => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    searchApi({ q: query.trim(), limit })
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
  }, [query, limit])

  return { items, total, loading, error, refetch }
}
