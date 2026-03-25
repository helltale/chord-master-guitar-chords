import { useTranslation } from '@/contexts/I18nContext'
import { useFollows } from '@/contexts/follows'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'

export function FavoritesPage() {
  const { t } = useTranslation()
  const { followedArtists, followedSongs } = useFollows()

  const artistsSorted = useMemo(
    () =>
      [...followedArtists].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      ),
    [followedArtists],
  )

  const songsSorted = useMemo(
    () =>
      [...followedSongs].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      ),
    [followedSongs],
  )

  return (
    <div className="relative flex min-h-0 flex-1 flex-col -mx-4 -my-6 overflow-hidden bg-slate-950 px-4 py-8">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
              {t('header.nav.favorites', 'Favorites')}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400 md:text-base">
              {t('favorites.pageSubtitle')}
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400 p-6 text-slate-50 shadow-[0_24px_70px_rgba(56,189,248,0.55)] md:flex md:items-center md:justify-between md:gap-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold tracking-tight">
              {t('favorites.bannerTitle')}
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-100/80">
              {t('favorites.bannerText')}
            </p>
          </div>
          <Link
            to="/songs"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950/95 px-6 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_30px_rgba(15,23,42,0.9)] transition hover:bg-slate-900"
          >
            <span>▶</span>
            <span>{t('favorites.browseSongs')}</span>
          </Link>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>★</span>
              <span>{t('favorites.sectionArtists')}</span>
            </h2>
          </div>
          {artistsSorted.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
              {t('favorites.emptyArtists')}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" role="list">
              {artistsSorted.map((artist) => (
                <li key={artist.artist_id}>
                  <Link
                    to={`/artist/${artist.slug}`}
                    className="group flex flex-col items-center text-center"
                  >
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-950 text-2xl font-bold uppercase text-indigo-300 shadow-[0_0_32px_rgba(99,102,241,0.85)] group-hover:border-indigo-400">
                      {artist.name.charAt(0) || '?'}
                    </div>
                    <p className="line-clamp-1 text-xs font-semibold text-slate-100">
                      {artist.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-1 flex-col gap-3 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>★</span>
              <span>{t('favorites.sectionSongs')}</span>
            </h2>
          </div>
          {songsSorted.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
              {t('favorites.emptySongs')}
            </p>
          ) : (
            <ul className="flex flex-col gap-2" role="list">
              {songsSorted.map((song) => (
                <li key={song.song_id}>
                  <Link
                    to={`/song/${song.song_id}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition hover:border-indigo-400 hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-sm font-bold text-indigo-300">
                        ♪
                      </div>
                      <div className="flex flex-col">
                        <span className="line-clamp-1 text-sm font-semibold">
                          {song.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {song.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {song.tonality != null && (
                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] text-indigo-300">
                          {song.tonality}
                        </span>
                      )}
                      <span className="text-base text-amber-400">★</span>
                    </div>
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
