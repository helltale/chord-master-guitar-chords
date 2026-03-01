/** Generated from OpenAPI schema "Block". Do not edit. */

import type { ChordSegment } from './ChordSegment';

export type Block = {
  kind: 'instrumental' | 'lyrics';
  label?: string;
  chords?: string[];
  tab?: string;
  segments?: ChordSegment[];
};
