import { listArtists, listSongs } from '@/api/client'
import type { FollowsState } from './followsStorage'

const PAGE_SIZE = 500

async function fetchAllArtistIds(): Promise<Set<string>> {
  const ids = new Set<string>()
  let offset = 0
  for (;;) {
    const res = await listArtists({ limit: PAGE_SIZE, offset })
    const items = res.items ?? []
    for (const a of items) ids.add(a.artist_id)
    const total = res.total ?? 0
    offset += items.length
    if (offset >= total || items.length === 0) break
  }
  return ids
}

async function fetchAllSongIds(): Promise<Set<string>> {
  const ids = new Set<string>()
  let offset = 0
  for (;;) {
    const res = await listSongs({ limit: PAGE_SIZE, offset })
    const items = res.items ?? []
    for (const s of items) ids.add(s.song_id)
    const total = res.total ?? 0
    offset += items.length
    if (offset >= total || items.length === 0) break
  }
  return ids
}

/** IDs that still exist in the API (paginated fetch). */
export async function fetchExistingFollowIds(): Promise<{
  artistIds: Set<string>
  songIds: Set<string>
}> {
  const [artistIds, songIds] = await Promise.all([
    fetchAllArtistIds(),
    fetchAllSongIds(),
  ])
  return { artistIds, songIds }
}

export function pruneFollowsState(
  prev: FollowsState,
  artistIds: Set<string>,
  songIds: Set<string>
): FollowsState {
  const artists = { ...prev.artists }
  for (const id of Object.keys(artists)) {
    if (!artistIds.has(id)) delete artists[id]
  }
  const songs = { ...prev.songs }
  for (const id of Object.keys(songs)) {
    if (!songIds.has(id)) delete songs[id]
  }
  return { artists, songs }
}
