import { useTranslation } from '@/contexts/I18nContext'

interface TransposeControlProps {
  /** Сдвиг в полутонах от исходного варианта песни в базе (накапливается при +/-). */
  semitonesFromOriginal: number
  onTranspose: (deltaSemitones: number) => void
  loading: boolean
  disabled?: boolean
}

export function TransposeControl({
  semitonesFromOriginal,
  onTranspose,
  loading,
  disabled,
}: TransposeControlProps) {
  const { t } = useTranslation()
  const atOriginal = semitonesFromOriginal === 0
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-800 shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-black/40">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {t('transpose.label')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/90 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              atOriginal
                ? 'bg-emerald-500 dark:bg-emerald-400'
                : 'bg-amber-500 dark:bg-amber-400'
            }`}
          />
          <span>
            {semitonesFromOriginal > 0 ? `+${semitonesFromOriginal}` : semitonesFromOriginal}
          </span>
          {atOriginal && (
            <span className="text-slate-500">({t('transpose.original') ?? 'Original'})</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => onTranspose(-1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-base font-bold text-slate-800 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          aria-label={t('transpose.down') ?? 'Transpose down'}
        >
          –
        </button>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => onTranspose(1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-base font-bold text-slate-800 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          aria-label={t('transpose.up') ?? 'Transpose up'}
        >
          +
        </button>
      </div>
      {loading && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400">{t('common.loading')}</span>
      )}
    </div>
  )
}
