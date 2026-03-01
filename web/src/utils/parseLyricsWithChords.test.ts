import { describe, expect, it } from 'vitest'
import { parseLyricsWithChords } from './parseLyricsWithChords'

describe('parseLyricsWithChords', () => {
  it('returns empty sections for empty input', () => {
    expect(parseLyricsWithChords('')).toEqual({ sections: [] })
    expect(parseLyricsWithChords('   \n  \n  ')).toEqual({ sections: [] })
  })

  it('parses a line without chords as one segment with empty chord', () => {
    const result = parseLyricsWithChords('Just some lyrics')
    expect(result.sections).toHaveLength(1)
    expect(result.sections![0].blocks).toHaveLength(1)
    expect(result.sections![0].blocks![0].kind).toBe('lyrics')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: '', text: 'Just some lyrics' },
    ])
  })

  it('parses a line with one chord and text', () => {
    const result = parseLyricsWithChords('[Am] Hello world')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'Am', text: ' Hello world' },
    ])
  })

  it('parses a line with multiple chords and text between', () => {
    const result = parseLyricsWithChords('[Am] First [C] second [G] third')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'Am', text: ' First ' },
      { chord: 'C', text: ' second ' },
      { chord: 'G', text: ' third' },
    ])
  })

  it('parses chord-only line', () => {
    const result = parseLyricsWithChords('[Am][C][G]')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'Am', text: '' },
      { chord: 'C', text: '' },
      { chord: 'G', text: '' },
    ])
  })

  it('parses multiple lines as separate blocks', () => {
    const result = parseLyricsWithChords('[Am] Line one\n[C] Line two')
    expect(result.sections![0].blocks).toHaveLength(2)
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'Am', text: ' Line one' },
    ])
    expect(result.sections![0].blocks![1].segments).toEqual([
      { chord: 'C', text: ' Line two' },
    ])
  })

  it('parses empty line as block with one empty segment', () => {
    const result = parseLyricsWithChords('[Am] One\n\n[C] Two')
    expect(result.sections![0].blocks).toHaveLength(3)
    expect(result.sections![0].blocks![1].segments).toEqual([
      { chord: '', text: '' },
    ])
  })

  it('handles complex chord names', () => {
    const result = parseLyricsWithChords('[C#m7] text [Bb] more')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'C#m7', text: ' text ' },
      { chord: 'Bb', text: ' more' },
    ])
  })

  it('splits sections by header lines (Label:)', () => {
    const result = parseLyricsWithChords(
      '[Am] First verse line\nПрипев:\n[C] Chorus line one\n[G] Chorus line two'
    )
    expect(result.sections).toHaveLength(2)
    expect(result.sections![0].label).toBe('')
    expect(result.sections![0].blocks).toHaveLength(1)
    expect(result.sections![0].blocks![0].segments![0].chord).toBe('Am')
    expect(result.sections![1].label).toBe('Припев')
    expect(result.sections![1].blocks).toHaveLength(2)
    expect(result.sections![1].blocks![0].segments![0].chord).toBe('C')
    expect(result.sections![1].blocks![1].segments![0].chord).toBe('G')
  })

  it('treats only "Something:" lines as section headers', () => {
    const result = parseLyricsWithChords('Куплет 1:\n[F] Улетают мысли, [Dm] тянутся')
    expect(result.sections).toHaveLength(1)
    expect(result.sections![0].label).toBe('Куплет 1')
    expect(result.sections![0].blocks).toHaveLength(1)
    expect(result.sections![0].blocks![0].segments).toHaveLength(2)
  })

  it('supports chord mid-word (полуслове)', () => {
    const result = parseLyricsWithChords('полу[Am]слове')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: '', text: 'полу' },
      { chord: 'Am', text: 'слове' },
    ])
  })

  it('supports chord with only spaces (chord after word)', () => {
    const result = parseLyricsWithChords('[F] слово   [Dm]   [Am] ещё')
    expect(result.sections![0].blocks![0].segments).toEqual([
      { chord: 'F', text: ' слово   ' },
      { chord: 'Dm', text: '   ' },
      { chord: 'Am', text: ' ещё' },
    ])
  })
})
