interface TransposeControlProps {
  onTranspose: (semitones: number) => void
  loading: boolean
  disabled?: boolean
}

const SEMITONE_OPTIONS = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]

export function TransposeControl({
  onTranspose,
  loading,
  disabled,
}: TransposeControlProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Транспонировать:</span>
      <div className="flex flex-wrap gap-1">
        {SEMITONE_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled || loading}
            onClick={() => onTranspose(n)}
            className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {n >= 0 ? `+${n}` : n}
          </button>
        ))}
      </div>
      {loading && (
        <span className="text-sm text-gray-500 dark:text-gray-400">Загрузка...</span>
      )}
    </div>
  )
}
