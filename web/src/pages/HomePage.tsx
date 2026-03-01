import { useState } from 'react'
import { useSearch } from '@/hooks'
import { SearchBar } from '@/components/SearchBar'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { items, total, loading, error } = useSearch(query)

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Главная</h1>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        items={items}
        total={total}
        loading={loading}
        error={error}
      />
    </div>
  )
}
