import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useListSongs, useListArtists } from '@/hooks'
import { useTranslation } from '@/contexts/I18nContext'

export function SongsPage() {
  const { t } = useTranslation()
  const { items, total, loading, error } = useListSongs({ limit: 500 })
  const { items: artists } = useListArtists({ limit: 500 })
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((s) => s.title.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
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
        {/* Header */}
        <section className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
              {t('songsPage.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-400 md:text-base">
              {t('songsPage.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/songs/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_26px_rgba(99,102,241,0.9)] transition hover:bg-indigo-400"
            >
              <span>＋</span>
              <span>{t('header.createSong')}</span>
            </Link>
          </div>
        </section>

        {/* Filters / search */}
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[220px] flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                🔍
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.label')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="flex-1 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <th className="px-5 py-3">{t('songs.tableTitle')}</th>
                  <th className="px-5 py-3">{t('songs.tableArtist')}</th>
                  <th className="px-5 py-3">{t('songs.tableSlug')}</th>
                  <th className="px-5 py-3 text-right">{t('song.tonality')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((song) => {
                  const artistName =
                    artists.find((a) => a.artist_id === song.artist_id)?.name ?? '—'

                  return (
                    <tr
                      key={song.song_id}
                      className="cursor-pointer bg-slate-950/40 transition hover:bg-slate-900/80"
                    >
                      <td className="px-5 py-3">
                        <Link
                          to={`/song/${song.song_id}`}
                          className="flex items-center gap-3 text-slate-100 hover:text-indigo-200"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            ♪
                          </div>
                          <span className="truncate text-sm font-semibold">{song.title}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-300">{artistName}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{song.slug}</td>
                      <td className="px-5 py-3 text-right text-xs">
                        {song.tonality != null && (
                          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] text-indigo-300">
                            {song.tonality}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/80 px-5 py-3 text-xs text-slate-500">
            <span>
              {t('songs.listFooter')
                .replace('{shown}', String(filtered.length))
                .replace('{total}', String(total || filtered.length))}
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

