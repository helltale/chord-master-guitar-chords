/**
 * Runtime config from environment.
 * VITE_* variables are exposed by Vite (see https://vitejs.dev/guide/env-and-mode).
 */
const base = import.meta.env.VITE_API_BASE
export const apiBaseUrl =
  typeof base === 'string' && base.length > 0 ? base : '/api/amdm/v1'
