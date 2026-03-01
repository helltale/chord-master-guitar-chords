import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSong } from './useSong'

const getSongMock = vi.fn()
vi.mock('@/api/client', () => ({
  getSong: (id: string) => getSongMock(id),
}))

describe('useSong', () => {
  beforeEach(() => {
    getSongMock.mockReset()
  })

  it('returns loading then song on success when songId is set', async () => {
    const song = {
      song_id: '11111111-1111-1111-1111-111111111111',
      title: 'Test Song',
      slug: 'test-song',
    }
    getSongMock.mockResolvedValue(song)
    const { result } = renderHook(() => useSong(song.song_id))

    expect(result.current.loading).toBe(true)
    expect(result.current.song).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.song).toEqual(song)
    expect(result.current.error).toBe(null)
    expect(getSongMock).toHaveBeenCalledWith(song.song_id)
  })

  it('sets error and null song on API failure', async () => {
    const err = new Error('not found')
    getSongMock.mockRejectedValue(err)
    const { result } = renderHook(() => useSong('00000000-0000-0000-0000-000000000000'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.song).toBe(null)
    expect(result.current.error).toBe(err)
  })

  it('does not call API when songId is undefined', async () => {
    const { result } = renderHook(() => useSong(undefined))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(getSongMock).not.toHaveBeenCalled()
    expect(result.current.song).toBe(null)
  })
})
