import { Link } from 'react-router-dom'
import type { SongListItem } from '@/api/schemas'

interface SongCardProps {
  item: SongListItem
}

export function SongCard({ item }: SongCardProps) {
  return (
    <Link
      to={`/song/${item.song_id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition"
    >
      <span className="font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
      {item.tonality != null && (
        <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">({item.tonality})</span>
      )}
    </Link>
  )
}
