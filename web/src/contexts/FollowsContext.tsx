import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'amdm-guitar-chords:follows:v1'

export type FollowedArtistSnapshot = {
  artist_id: string
  name: string
  slug: string
}

export type FollowedSongSnapshot = {
  song_id: string
  title: string
  slug: string
  tonality?: number
}

type FollowsState = {
  artists: Record<string, FollowedArtistSnapshot>
  songs: Record<string, FollowedSongSnapshot>
}

export type FollowsContextValue = {
  followedArtists: FollowedArtistSnapshot[]
  followedSongs: FollowedSongSnapshot[]
  isArtistFollowed: (artistId: string) => boolean
  isSongFollowed: (songId: string) => boolean
  toggleArtistFollow: (artist: FollowedArtistSnapshot) => void
  toggleSongFollow: (song: FollowedSongSnapshot) => void
}

function loadState(): FollowsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { artists: {}, songs: {} }
    const parsed = JSON.parse(raw) as Partial<FollowsState>
    return {
      artists:
        parsed.artists && typeof parsed.artists === 'object'
          ? parsed.artists
          : {},
      songs:
        parsed.songs && typeof parsed.songs === 'object' ? parsed.songs : {},
    }
  } catch {
    return { artists: {}, songs: {} }
  }
}

const FollowsContext = createContext<FollowsContextValue | null>(null)

export function FollowsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FollowsState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
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

export function useFollows(): FollowsContextValue {
  const ctx = useContext(FollowsContext)
  if (!ctx) {
    throw new Error('useFollows must be used within FollowsProvider')
  }
  return ctx
}
