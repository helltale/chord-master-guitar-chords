import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SongContent } from './SongContent'

describe('SongContent', () => {
  it('renders sections and lyrics blocks with chord and text', () => {
    const content = {
      sections: [
        {
          label: 'Verse 1',
          blocks: [
            {
              kind: 'lyrics' as const,
              segments: [
                { chord: 'Am', text: ' first ' },
                { chord: 'C', text: ' second' },
              ],
            },
          ],
        },
      ],
    }
    render(<SongContent content={content} />)
    expect(screen.getByText('Verse 1')).toBeInTheDocument()
    expect(screen.getByText(/\[Am\]/)).toBeInTheDocument()
    expect(screen.getByText(/first/)).toBeInTheDocument()
    expect(screen.getByText(/\[C\]/)).toBeInTheDocument()
    expect(screen.getByText(/second/)).toBeInTheDocument()
  })

  it('renders empty state when no sections', () => {
    const content = { sections: [] }
    const { container } = render(<SongContent content={content} />)
    expect(container.querySelector('article')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
  })
})
