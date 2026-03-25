import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FollowsContext } from './followsContext'
import type {
  FollowedArtistSnapshot,
  FollowedSongSnapshot,
  FollowsContextValue,
} from './followsTypes'
import { FOLLOWS_STORAGE_KEY, loadFollowsState } from './followsStorage'
import { fetchExistingFollowIds, pruneFollowsState } from './reconcileFollows'

export function FollowsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadFollowsState)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { artistIds, songIds } = await fetchExistingFollowIds()
        if (cancelled) return
        setState((prev) => pruneFollowsState(prev, artistIds, songIds))
      } catch {
        /* offline / server error — keep cached follows */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWS_STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota / private mode */
    }
  }, [state])

  const toggleArtistFollow = useCallback((artist: FollowedArtistSnapshot) => {
    setState((prev) => {
      const artists = { ...prev.artists }
      if (artists[artist.artist_id]) delete artists[artist.artist_id]
      else artists[artist.artist_id] = artist
      return { ...prev, artists }
    })
  }, [])

  const toggleSongFollow = useCallback((song: FollowedSongSnapshot) => {
    setState((prev) => {
      const songs = { ...prev.songs }
      if (songs[song.song_id]) delete songs[song.song_id]
      else songs[song.song_id] = { ...song }
      return { ...prev, songs }
    })
  }, [])

  const value = useMemo<FollowsContextValue>(
    () => ({
      followedArtists: Object.values(state.artists),
      followedSongs: Object.values(state.songs),
      isArtistFollowed: (artistId: string) => Boolean(state.artists[artistId]),
      isSongFollowed: (songId: string) => Boolean(state.songs[songId]),
      toggleArtistFollow,
      toggleSongFollow,
    }),
    [state, toggleArtistFollow, toggleSongFollow],
  )

  return (
    <FollowsContext.Provider value={value}>{children}</FollowsContext.Provider>
  )
}
