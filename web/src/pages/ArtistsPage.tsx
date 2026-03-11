import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useListArtists } from '@/hooks'
import { useTranslation } from '@/contexts/I18nContext'

export function ArtistsPage() {
  const { t } = useTranslation()
  const { items, total, loading, error } = useListArtists({ limit: 500 })
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((a) => a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q))
  }, [items, query])

  if (loading && items.length === 0) {
    return (
      <div className="py-8 text-slate-400">
        {t('common.loading')}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-red-500 dark:text-red-400" role="alert">
          {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col -mx-4 -my-6 overflow-hidden bg-slate-950 px-4 py-8">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8">
        {/* Page header */}
        <section className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {t('header.nav.artists', 'Artists')}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            {t('header.nav.artists', 'Artists')}
          </h1>
          {total > 0 && (
            <p className="text-xs text-slate-500">
              {total} {t('search.artists', 'Artists')}
            </p>
          )}
        </section>

        {/* Filters & search */}
        <section className="flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.label', 'Search artists and songs')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </section>

        {/* Artists grid */}
        <section className="flex flex-1 flex-col gap-4 pb-6">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 px-4 py-6 text-sm text-slate-500">
              {t('search.noArtists', 'No artists for this query yet.')}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
              {filtered.map((artist) => (
                <li key={artist.artist_id}>
                  <Link
                    to={`/artist/${artist.slug}`}
                    className="group flex h-full flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center shadow-[0_18px_50px_rgba(15,23,42,0.85)] transition hover:border-indigo-400 hover:bg-slate-900"
                  >
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-indigo-500/80 bg-slate-950 text-2xl font-bold uppercase text-indigo-300 shadow-[0_0_32px_rgba(99,102,241,0.85)]">
                      {artist.name.charAt(0) || '?'}
                    </div>
                    <h2 className="mb-1 text-sm font-semibold text-slate-50 line-clamp-1">{artist.name}</h2>
                    <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                      {artist.slug}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-200">
                      <span>View songs</span>
                      <span>↗</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

