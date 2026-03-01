/** Generated from OpenAPI schema "Song". Do not edit. */

import type { TabContent } from './TabContent';

export type Song = {
  song_id: string;
  artist_id?: string;
  title: string;
  slug: string;
  tonality?: number;
  content?: TabContent;
  created_at?: string;
  updated_at?: string;
};
