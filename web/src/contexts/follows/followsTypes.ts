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

export type FollowsContextValue = {
  followedArtists: FollowedArtistSnapshot[]
  followedSongs: FollowedSongSnapshot[]
  isArtistFollowed: (artistId: string) => boolean
  isSongFollowed: (songId: string) => boolean
  toggleArtistFollow: (artist: FollowedArtistSnapshot) => void
  toggleSongFollow: (song: FollowedSongSnapshot) => void
}
