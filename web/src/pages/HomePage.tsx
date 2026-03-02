import { useState } from 'react'
import { useSearch } from '@/hooks'
import { SearchBar } from '@/components/SearchBar'
import { MouseReactiveBackground } from '@/components/MouseReactiveBackground'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { items, total, loading, error } = useSearch(query)

  return (
    <div className="relative flex-1 flex flex-col min-h-0 -mx-4 -my-6 px-4 py-6">
      <MouseReactiveBackground />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          items={items}
          total={total}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
