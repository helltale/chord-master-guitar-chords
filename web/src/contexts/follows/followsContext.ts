import { createContext } from 'react'
import type { FollowsContextValue } from './followsTypes'

export const FollowsContext = createContext<FollowsContextValue | null>(null)
