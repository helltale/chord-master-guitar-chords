import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChordFingeringPanel } from './ChordFingeringPanel'

describe('ChordFingeringPanel', () => {
  it('renders chord names and tab for each entry', () => {
    const chordTabs: Record<string, string> = {
      Am: 'e|-0-|\nB|-1-|',
      C: 'e|-0-|\nB|-1-|\nG|-0-|',
    }
    render(<ChordFingeringPanel chordTabs={chordTabs} />)
    expect(screen.getByText('Аппликатуры аккордов')).toBeInTheDocument()
    expect(screen.getByText('Am')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText(/e\|-0-\|/)).toBeInTheDocument()
  })

  it('renders nothing when chordTabs is empty', () => {
    const { container } = render(<ChordFingeringPanel chordTabs={{}} />)
    expect(container.firstChild).toBeNull()
  })
})
