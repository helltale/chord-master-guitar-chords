import { useTranslation } from '@/contexts/I18nContext'

interface ChordFingeringPanelProps {
  chordTabs: Record<string, string>
}

export function ChordFingeringPanel({ chordTabs }: ChordFingeringPanelProps) {
  const { t } = useTranslation()
  const entries = Object.entries(chordTabs)
  if (entries.length === 0) return null

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-950/60 p-4 shadow-sm shadow-black/40 dark:border-slate-800">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {t('chordPanel.title')}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(([chord, tab]) => (
          <div
            key={chord}
            className="group cursor-pointer rounded-xl border border-slate-700 bg-slate-900/70 p-3 shadow-sm shadow-black/40 transition-colors hover:border-indigo-400"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-indigo-300">
                {chord}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-slate-400">
                TAB
              </span>
            </div>
            <pre className="max-h-28 overflow-y-auto whitespace-pre-wrap break-all rounded-lg bg-slate-950/70 p-2 font-mono text-[11px] text-slate-100 custom-scrollbar">
              {tab}
            </pre>
          </div>
        ))}
      </div>
    </aside>
  )
}
