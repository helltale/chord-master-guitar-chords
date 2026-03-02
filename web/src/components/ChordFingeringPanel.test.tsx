import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '@/contexts/I18nContext'
import { ChordFingeringPanel } from './ChordFingeringPanel'

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe('ChordFingeringPanel', () => {
  it('renders chord names and tab for each entry', () => {
    const chordTabs: Record<string, string> = {
      Am: 'e|-0-|\nB|-1-|',
      C: 'e|-0-|\nB|-1-|\nG|-0-|',
    }
    renderWithI18n(<ChordFingeringPanel chordTabs={chordTabs} />)
    expect(screen.getByText('Аппликатуры аккордов')).toBeInTheDocument()
    expect(screen.getByText('Am')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getAllByText(/e\|-0-\|/).length).toBe(2)
  })

  it('renders nothing when chordTabs is empty', () => {
    const { container } = renderWithI18n(<ChordFingeringPanel chordTabs={{}} />)
    expect(container.firstChild).toBeNull()
  })
})
