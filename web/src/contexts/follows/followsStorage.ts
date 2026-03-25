import type { FollowedArtistSnapshot, FollowedSongSnapshot } from './followsTypes'

export const FOLLOWS_STORAGE_KEY = 'amdm-guitar-chords:follows:v1'

export type FollowsState = {
  artists: Record<string, FollowedArtistSnapshot>
  songs: Record<string, FollowedSongSnapshot>
}

export function loadFollowsState(): FollowsState {
  try {
    const raw = localStorage.getItem(FOLLOWS_STORAGE_KEY)
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
