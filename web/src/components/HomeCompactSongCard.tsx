import { Link } from 'react-router-dom'
import type { SongListItem } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'

/** Compact home grid card (popular / recently added columns). */
export function HomeCompactSongCard({ song }: { song: SongListItem }) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/song/${song.song_id}`}
      className="group flex min-h-0 w-full flex-col items-center rounded-xl border border-slate-200 bg-white/90 px-1.5 py-2 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_12px_32px_rgba(15,23,42,0.75)] dark:hover:bg-slate-900"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500/80 bg-slate-100 text-sm font-bold uppercase text-indigo-600 shadow-[0_0_18px_rgba(99,102,241,0.35)] dark:bg-slate-950 dark:text-indigo-300 dark:shadow-[0_0_24px_rgba(99,102,241,0.65)]">
        {song.title.trim().charAt(0) || '♪'}
      </div>
      <h3 className="mt-1.5 line-clamp-2 w-full text-[10px] font-semibold leading-snug text-slate-900 dark:text-slate-50">
        {song.title}
      </h3>
      {(song.artist_name || song.tonality != null) && (
        <p className="mt-0.5 line-clamp-1 w-full text-[9px] text-slate-500 dark:text-slate-400">
          {song.artist_name}
          {song.artist_name && song.tonality != null && ' · '}
          {song.tonality != null && (
            <span className="font-mono text-slate-600 dark:text-slate-300">{song.tonality}</span>
          )}
        </p>
      )}
      <span className="mt-auto inline-flex max-w-full items-center gap-0.5 rounded-full bg-slate-100/90 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-600 group-hover:bg-indigo-500/10 group-hover:text-indigo-700 dark:bg-slate-950/80 dark:text-slate-400 dark:group-hover:text-indigo-200">
        <span className="truncate">{t('common.view')}</span>
        <span aria-hidden>↗</span>
      </span>
    </Link>
  )
}
