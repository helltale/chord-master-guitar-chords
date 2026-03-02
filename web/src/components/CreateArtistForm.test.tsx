import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/contexts/I18nContext'
import { CreateArtistForm } from './CreateArtistForm'

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe('CreateArtistForm', () => {
  it('calls onSubmit with name and slug when form is submitted', async () => {
    const onSubmit = vi.fn()
    renderWithI18n(
      <CreateArtistForm onSubmit={onSubmit} loading={false} error={null} />
    )
    await userEvent.type(screen.getByLabelText(/имя|name/i), 'Test Artist')
    await userEvent.type(screen.getByLabelText(/slug|ЧПУ|адрес страницы/i), 'test-artist')
    await userEvent.click(screen.getByRole('button', { name: /создать артиста|create artist/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Test Artist', slug: 'test-artist' })
  })

  it('displays error when error prop is set', () => {
    const err = new Error('Slug already exists')
    renderWithI18n(
      <CreateArtistForm onSubmit={vi.fn()} loading={false} error={err} />
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Slug already exists')
  })
})
