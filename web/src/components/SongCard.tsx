import { Link } from 'react-router-dom'
import type { SongListItem } from '@/api/schemas'

interface SongCardProps {
  item: SongListItem
}

export function SongCard({ item }: SongCardProps) {
  return (
    <Link
      to={`/song/${item.song_id}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 px-4 py-3 text-sm text-slate-100 shadow-md shadow-black/50 transition hover:border-indigo-400 hover:shadow-[0_18px_40px_rgba(15,23,42,0.9)]"
    >
      <span className="font-medium">{item.title}</span>
      {item.tonality != null && (
        <span className="mt-1 inline-flex w-fit rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-slate-400">
          KEY {item.tonality}
        </span>
      )}
    </Link>
  )
}
