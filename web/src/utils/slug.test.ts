import { describe, expect, it } from 'vitest'
import { slugFromString } from './slug'

describe('slugFromString', () => {
  it('trims and lowercases', () => {
    expect(slugFromString('  Foo Bar  ')).toBe('foo-bar')
  })

  it('replaces spaces with hyphen', () => {
    expect(slugFromString('hello world')).toBe('hello-world')
    expect(slugFromString('a  b   c')).toBe('a-b-c')
  })

  it('removes characters outside [a-z0-9а-яё-]', () => {
    expect(slugFromString('hello!')).toBe('hello')
    expect(slugFromString('test@mail')).toBe('testmail')
    expect(slugFromString('café')).toBe('caf')
    expect(slugFromString('привет')).toBe('привет')
    expect(slugFromString('ёлка')).toBe('ёлка')
  })

  it('returns empty string for empty input', () => {
    expect(slugFromString('')).toBe('')
    expect(slugFromString('   ')).toBe('')
  })

  it('keeps hyphens and alphanumeric', () => {
    expect(slugFromString('some-song')).toBe('some-song')
    expect(slugFromString('Song 123')).toBe('song-123')
  })
})
