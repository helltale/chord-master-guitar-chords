import type { SongListItem } from '@/api/schemas'
import { SongCard } from './SongCard'

interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  items: SongListItem[]
  total: number
  loading: boolean
  error: Error | null
}

export function SearchBar({
  query,
  onQueryChange,
  items,
  total,
  loading,
  error,
}: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="search" className="sr-only">
        Поиск исполнителей и произведений
      </label>
      <input
        id="search"
        type="search"
        placeholder="Поиск по песням и исполнителям..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        autoFocus
      />
      <div className="mt-4">
        {loading && (
          <p className="text-gray-500 text-sm">Загрузка...</p>
        )}
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            Ошибка: {error.message}
          </p>
        )}
        {!loading && !error && query.trim() && (
          <>
            <p className="text-gray-600 text-sm mb-2">
              Найдено: {total}
            </p>
            <ul className="space-y-2" role="list">
              {items.length === 0 ? (
                <li className="text-gray-500">Ничего не найдено</li>
              ) : (
                items.map((item) => (
                  <li key={item.song_id}>
                    <SongCard item={item} />
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
