import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateArtistForm } from './CreateArtistForm'

describe('CreateArtistForm', () => {
  it('calls onSubmit with name and slug when form is submitted', async () => {
    const onSubmit = vi.fn()
    render(
      <CreateArtistForm onSubmit={onSubmit} loading={false} error={null} />
    )
    await userEvent.type(screen.getByLabelText(/имя/i), 'Test Artist')
    await userEvent.type(screen.getByLabelText(/slug/i), 'test-artist')
    await userEvent.click(screen.getByRole('button', { name: /создать артиста/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Test Artist', slug: 'test-artist' })
  })

  it('displays error when error prop is set', () => {
    const err = new Error('Slug already exists')
    render(
      <CreateArtistForm onSubmit={vi.fn()} loading={false} error={err} />
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Slug already exists')
  })
})
