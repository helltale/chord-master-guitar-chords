import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/I18nContext'
import { useFollows } from '@/contexts/follows'
import { useArtistBySlug } from '@/hooks'
import { SongCard } from '@/components/SongCard'

export function ArtistPage() {
  const { artistSlug } = useParams<{ artistSlug: string }>()
  const { t } = useTranslation()
  const { isArtistFollowed, toggleArtistFollow } = useFollows()
  const { artist, loading, error } = useArtistBySlug(artistSlug)

  if (loading && !artist) {
    return (
      <div className="py-8 text-gray-500 dark:text-gray-400">
        {t('common.loading')}
      </div>
    )
  }
  if (error || !artist) {
    return (
      <div className="py-8">
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error ? error.message : t('common.artistNotFound')}
        </p>
      </div>
    )
  }

  const songs = artist.songs ?? []
  const followed = isArtistFollowed(artist.artist_id)
  const snapshot = {
    artist_id: artist.artist_id,
    name: artist.name,
    slug: artist.slug,
  }
  const handleToggleFollow = () => toggleArtistFollow(snapshot)

  return (
    <div className="flex flex-1 flex-col px-4 py-6 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
        {/* Page header, aligned with other pages */}
        <section className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
            {t('header.nav.artists', 'Artists')}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
            {artist.name}
          </h1>
          <p className="text-xs text-slate-500">
            slug: {artist.slug} · {songs.length} {t('artist.songs')}
          </p>
        </section>

        {/* Artist hero card */}
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_16px_52px_rgba(15,23,42,0.08)] transition-[border-color,background-color,box-shadow] duration-300 md:flex-row md:items-center md:justify-between md:p-8 dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-[0_24px_70px_rgba(15,23,42,0.9)]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-indigo-500 text-3xl font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.9)] md:h-24 md:w-24">
                {artist.name.charAt(0).toLowerCase()}
              </div>
              <button
                type="button"
                onClick={handleToggleFollow}
                aria-pressed={followed}
                aria-label={
                  followed ? t('common.removeFavorite') : t('common.favorite')
                }
                className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] ring-2 ring-white transition dark:ring-slate-950 ${
                  followed
                    ? 'bg-amber-500/90 text-slate-950 hover:bg-amber-400'
                    : 'bg-slate-200 text-indigo-700 hover:bg-slate-300 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800'
                }`}
              >
                ★
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-50">
                {artist.name}
              </h1>
              <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
                slug: {artist.slug}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="rounded-full bg-slate-200/90 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-slate-800 dark:bg-slate-900 dark:text-inherit">
                  {t('artist.songs')} · {songs.length}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <button
              type="button"
              onClick={handleToggleFollow}
              aria-pressed={followed}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ring-1 transition ${
                followed
                  ? 'bg-amber-500/15 text-amber-700 ring-amber-400/50 hover:bg-amber-500/25 dark:text-amber-200'
                  : 'bg-slate-200/90 text-slate-800 ring-slate-300 hover:bg-slate-300/90 dark:bg-slate-900/80 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              <span aria-hidden>{followed ? '♥' : '♡'}</span>
              {followed ? t('artist.unfollow') : t('artist.follow')}
            </button>
          </div>
        </section>

        {/* Songs list */}
        <section className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              {t('artist.songs')}
            </h2>
            {songs.length > 0 ? (
              <span className="text-[11px] text-slate-500">
                {songs.length} {t('artist.songs')}
              </span>
            ) : (
              <Link
                to={`/songs/new?artist_id=${encodeURIComponent(artist.artist_id)}`}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.9)] hover:bg-indigo-400"
              >
                <span>＋</span>
                <span>{t('createSong.title')}</span>
              </Link>
            )}
          </div>
          {songs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-500">
              <p>{t('artist.noSongs')}</p>
              <p className="mt-2 text-xs text-slate-500">
                {t('createSong.subtitle')}
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {songs.map((item) => (
                <li key={item.song_id}>
                  <SongCard item={item} showFavoriteToggle />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
