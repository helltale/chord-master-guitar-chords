import { useTranslation } from '@/contexts/I18nContext'

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
  const { t } = useTranslation()
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 shadow-sm shadow-black/40 dark:border-slate-700">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {t('transpose.label')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>0</span>
          <span className="text-slate-500">({t('transpose.original') ?? 'Original'})</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => onTranspose(-1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-base font-bold text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={t('transpose.down') ?? 'Transpose down'}
        >
          –
        </button>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => onTranspose(1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-base font-bold text-slate-100 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={t('transpose.up') ?? 'Transpose up'}
        >
          +
        </button>
      </div>
      {loading && (
        <span className="text-[10px] text-slate-400">{t('common.loading')}</span>
      )}
    </div>
  )
}
