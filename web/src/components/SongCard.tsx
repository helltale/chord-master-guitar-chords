import { Link } from 'react-router-dom'
import type { SongListItem } from '@/api/schemas'
import { useFollows } from '@/contexts/follows'
import { useTranslation } from '@/contexts/I18nContext'

interface SongCardProps {
  item: SongListItem
  /** Star control synced with favorites (e.g. on artist page). */
  showFavoriteToggle?: boolean
}

export function SongCard({ item, showFavoriteToggle }: SongCardProps) {
  const { t } = useTranslation()
  const { isSongFollowed, toggleSongFollow } = useFollows()
  const followed = isSongFollowed(item.song_id)

  const linkClass =
    'group flex flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 px-4 py-3 text-sm text-slate-800 shadow-md shadow-slate-900/6 transition-[border-color,background-color,box-shadow] duration-200 hover:border-indigo-400 hover:shadow-[0_14px_36px_rgba(79,70,229,0.12)] dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100 dark:shadow-black/50 dark:hover:shadow-[0_18px_40px_rgba(15,23,42,0.9)]' +
    (showFavoriteToggle ? ' pr-11 pt-3.5' : '')

  const body = (
    <>
      <span className="font-medium">{item.title}</span>
      {item.tonality != null && (
        <span className="mt-1 inline-flex w-fit rounded-full bg-slate-200/90 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          KEY {item.tonality}
        </span>
      )}
    </>
  )

  if (!showFavoriteToggle) {
    return (
      <Link to={`/song/${item.song_id}`} className={linkClass}>
        {body}
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          toggleSongFollow({
            song_id: item.song_id,
            title: item.title,
            slug: item.slug,
            tonality: item.tonality,
          })
        }
        aria-pressed={followed}
        aria-label={
          followed ? t('common.removeFavorite') : t('common.favorite')
        }
        className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs shadow-md ring-1 transition ${
          followed
            ? 'bg-amber-500/20 text-amber-400 ring-amber-400/40 hover:bg-amber-500/30'
            : 'bg-white/95 text-slate-500 ring-slate-300 hover:bg-slate-100 hover:text-indigo-600 hover:ring-indigo-400/50 dark:bg-slate-950/90 dark:text-slate-500 dark:ring-slate-700 dark:hover:bg-slate-900 dark:hover:text-indigo-300 dark:hover:ring-indigo-500/50'
        }`}
      >
        ★
      </button>
      <Link to={`/song/${item.song_id}`} className={linkClass}>
        {body}
      </Link>
    </div>
  )
}
