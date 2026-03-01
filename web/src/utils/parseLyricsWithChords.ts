import type { TabContent, Section, Block, ChordSegment } from '@/api/schemas'

const CHORD_REGEX = /\[([^\]]*)\]/g

/**
 * Parses a single line into chord segments.
 * E.g. "[Am] Hello [C] world" -> [{ chord: "Am", text: " Hello " }, { chord: "C", text: " world" }]
 */
function parseLine(line: string): ChordSegment[] {
  const segments: ChordSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  CHORD_REGEX.lastIndex = 0
  while ((match = CHORD_REGEX.exec(line)) !== null) {
    const text = line.slice(lastIndex, match.index)
    if (segments.length > 0) {
      segments[segments.length - 1].text = text
    } else if (text) {
      segments.push({ chord: '', text })
    }
    segments.push({ chord: match[1] ?? '' })
    lastIndex = match.index + match[0].length
  }

  const tail = line.slice(lastIndex)
  if (segments.length > 0) {
    segments[segments.length - 1].text = tail
  } else if (tail) {
    segments.push({ chord: '', text: tail })
  }

  if (segments.length === 0) {
    segments.push({ chord: '', text: '' })
  }

  return segments
}

/** Line that is only "Label:" (optional spaces) — treated as section header. */
const SECTION_HEADER_REGEX = /^([^:\n]+):\s*$/

/**
 * Parses multiline lyrics with chords in square brackets into TabContent.
 * Format: "[Am] text [C] more text" per line; each line becomes one lyrics block.
 * A line ending with ":" (e.g. "Припев:", "Куплет 1:") starts a new section with that label.
 * Empty lines become a block with one empty segment.
 */
export function parseLyricsWithChords(raw: string): TabContent {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { sections: [] }
  }

  const lines = raw.split(/\r?\n/)
  const sections: Section[] = []
  let currentLabel = ''
  let currentBlocks: Block[] = []

  for (const line of lines) {
    const headerMatch = line.match(SECTION_HEADER_REGEX)
    if (headerMatch) {
      if (currentBlocks.length > 0) {
        sections.push({
          type: 'verse',
          label: currentLabel,
          blocks: currentBlocks,
        })
        currentBlocks = []
      }
      currentLabel = headerMatch[1].trim()
    } else {
      currentBlocks.push({
        kind: 'lyrics',
        segments: parseLine(line),
      })
    }
  }

  if (currentBlocks.length > 0) {
    sections.push({
      type: 'verse',
      label: currentLabel,
      blocks: currentBlocks,
    })
  }

  return { sections }
}
