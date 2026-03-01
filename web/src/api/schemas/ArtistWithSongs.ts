/** Generated from OpenAPI schema "ArtistWithSongs". Do not edit. */

import type { Artist } from './Artist';
import type { SongListItem } from './SongListItem';

export type ArtistWithSongs = (Artist & {
  songs?: SongListItem[];
});
