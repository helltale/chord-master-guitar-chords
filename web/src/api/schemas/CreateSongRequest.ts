/** Generated from OpenAPI schema "CreateSongRequest". Do not edit. */

import type { TabContent } from './TabContent';

export type CreateSongRequest = {
  artist_id: string;
  title: string;
  slug: string;
  tonality?: number;
  content?: TabContent;
};
