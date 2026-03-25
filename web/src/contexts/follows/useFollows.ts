import { useContext } from 'react'
import { FollowsContext } from './followsContext'
import type { FollowsContextValue } from './followsTypes'

export function useFollows(): FollowsContextValue {
  const ctx = useContext(FollowsContext)
  if (!ctx) {
    throw new Error('useFollows must be used within FollowsProvider')
  }
  return ctx
}
