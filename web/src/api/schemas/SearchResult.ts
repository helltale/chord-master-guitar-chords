/** Generated from OpenAPI schema "SearchResult". Do not edit. */

import type { Artist } from './Artist';
import type { SongListItem } from './SongListItem';

export type SearchResult = {
  artists: Artist[];
  total_artists: number;
  songs: SongListItem[];
  total_songs: number;
};
