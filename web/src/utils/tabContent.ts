import type { TabContent } from '@/api/schemas'

export function isContentEmpty(content: TabContent): boolean {
  const sections = content.sections ?? []
  if (sections.length === 0) return true
  if (sections.length > 1) return false
  const sec = sections[0]
  const blocks = sec.blocks ?? []
  if (blocks.length === 0) return true
  if (blocks.length > 1) return false
  const segs = blocks[0].segments ?? []
  if (segs.length === 0) return true
  if (segs.length > 1) return false
  const seg = segs[0]
  return !seg.chord && !(seg.text ?? '').trim()
}

const ASCII_CHORD_TABS: Record<string, string> = {
  G: [
    'e|--3--',
    'B|--0--',
    'G|--0--',
    'D|--0--',
    'A|--2--',
    'E|--3--',
  ].join('\n'),
  C: [
    'e|--0--',
    'B|--1--',
    'G|--0--',
    'D|--2--',
    'A|--3--',
    'E|--x--',
  ].join('\n'),
  D: [
    'e|--2--',
    'B|--3--',
    'G|--2--',
    'D|--0--',
    'A|--x--',
    'E|--x--',
  ].join('\n'),
  Am: [
    'e|--0--',
    'B|--1--',
    'G|--2--',
    'D|--2--',
    'A|--0--',
    'E|--x--',
  ].join('\n'),
  Em: [
    'e|--0--',
    'B|--0--',
    'G|--0--',
    'D|--2--',
    'A|--2--',
    'E|--0--',
  ].join('\n'),
  F: [
    'e|--1--',
    'B|--1--',
    'G|--2--',
    'D|--3--',
    'A|--3--',
    'E|--1--',
  ].join('\n'),
  Bm: [
    'e|--2--',
    'B|--3--',
    'G|--4--',
    'D|--4--',
    'A|--2--',
    'E|--x--',
  ].join('\n'),
}

export function buildChordTabsFromContent(content: TabContent): Record<string, string> {
  const chordTabs: Record<string, string> = {}

  // prefer chord_tabs из бэкенда, если они есть
  if (content.chord_tabs) {
    for (const [chord, tab] of Object.entries(content.chord_tabs)) {
      if (tab) chordTabs[chord] = tab
    }
  }

  const sections = content.sections ?? []
  const chords = new Set<string>()

  for (const section of sections) {
    const blocks = section.blocks ?? []
    for (const block of blocks) {
      if (block.kind === 'lyrics') {
        for (const seg of block.segments ?? []) {
          const chord = (seg.chord ?? '').trim()
          if (chord) chords.add(chord)
        }
      }
      if (block.kind === 'instrumental') {
        for (const chord of block.chords ?? []) {
          const trimmed = chord.trim()
          if (trimmed) chords.add(trimmed)
        }
      }
    }
  }

  for (const chord of chords) {
    if (chordTabs[chord]) continue
    if (ASCII_CHORD_TABS[chord]) {
      chordTabs[chord] = ASCII_CHORD_TABS[chord]
    } else {
      chordTabs[chord] = `No predefined diagram yet for ${chord}.\n\nUse standard fingering or your preferred voicing.`
    }
  }

  return chordTabs
}
