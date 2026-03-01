import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearch } from './useSearch'

const searchMock = vi.fn()
vi.mock('@/api/client', () => ({
  search: (...args: unknown[]) => searchMock(...args),
}))

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    searchMock.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when query is empty', () => {
    it('clears items and does not call search API', async () => {
      searchMock.mockResolvedValue({ items: [{ song_id: '1', title: 'x', slug: 'x' }], total: 1 })
      const { rerender, result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'foo', limit: 20 } }
      )
      vi.advanceTimersByTime(350)
      await waitFor(() => {
        expect(result.current.items.length).toBe(1)
      })
      expect(searchMock).toHaveBeenCalledWith({ q: 'foo', limit: 20 })

      rerender({ query: '', limit: 20 })
      await waitFor(() => {
        expect(result.current.items).toEqual([])
        expect(result.current.total).toBe(0)
      })
      const callCountAfterClear = searchMock.mock.calls.length
      vi.advanceTimersByTime(500)
      expect(searchMock.mock.calls.length).toBe(callCountAfterClear)
    })
  })

  describe('when query is non-empty', () => {
    it('calls search API after debounce and sets items/total on success', async () => {
      const items = [
        { song_id: '1', title: 'Song One', slug: 'song-one' },
      ]
      searchMock.mockResolvedValue({ items, total: 1 })
      const { result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'song', limit: 20 } }
      )
      expect(searchMock).not.toHaveBeenCalled()
      vi.advanceTimersByTime(300)
      await waitFor(() => {
        expect(searchMock).toHaveBeenCalledWith({ q: 'song', limit: 20 })
      })
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.items).toEqual(items)
        expect(result.current.total).toBe(1)
      })
    })

    it('sets error and clears items on API failure', async () => {
      const err = new Error('network error')
      searchMock.mockRejectedValue(err)
      const { result } = renderHook(
        ({ query, limit }) => useSearch(query, limit),
        { initialProps: { query: 'fail', limit: 20 } }
      )
      vi.advanceTimersByTime(300)
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBe(err)
        expect(result.current.items).toEqual([])
        expect(result.current.total).toBe(0)
      })
    })
  })
})
