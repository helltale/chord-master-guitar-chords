import { useState, useEffect, useCallback } from 'react'
import { search as searchApi } from '@/api/client'
import type { Artist, SongListItem } from '@/api/schemas'

const DEBOUNCE_MS = 300

export function useSearch(query: string, limit = 20) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [songs, setSongs] = useState<SongListItem[]>([])
  const [totalArtists, setTotalArtists] = useState<number>(0)
  const [totalSongs, setTotalSongs] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setArtists([])
      setSongs([])
      setTotalArtists(0)
      setTotalSongs(0)
      setError(null)
      return
    }
    const t = setTimeout(() => {
      setLoading(true)
      setError(null)
      searchApi({ q: query.trim(), limit })
        .then((res) => {
          setArtists(res.artists ?? [])
          setSongs(res.songs ?? [])
          setTotalArtists(res.total_artists ?? 0)
          setTotalSongs(res.total_songs ?? 0)
        })
        .catch((e) => {
          setError(e)
          setArtists([])
          setSongs([])
          setTotalArtists(0)
          setTotalSongs(0)
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
        setArtists(res.artists ?? [])
        setSongs(res.songs ?? [])
        setTotalArtists(res.total_artists ?? 0)
        setTotalSongs(res.total_songs ?? 0)
      })
      .catch((e) => {
        setError(e)
        setArtists([])
        setSongs([])
        setTotalArtists(0)
        setTotalSongs(0)
      })
      .finally(() => setLoading(false))
  }, [query, limit])

  const total = totalArtists + totalSongs
  return { artists, songs, totalArtists, totalSongs, total, loading, error, refetch }
}
