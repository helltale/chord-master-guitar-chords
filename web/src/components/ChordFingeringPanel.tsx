interface ChordFingeringPanelProps {
  chordTabs: Record<string, string>
}

export function ChordFingeringPanel({ chordTabs }: ChordFingeringPanelProps) {
  const entries = Object.entries(chordTabs)
  if (entries.length === 0) return null

  return (
    <aside className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Аппликатуры аккордов
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map(([chord, tab]) => (
          <div
            key={chord}
            className="rounded border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="font-semibold text-indigo-600 mb-1">{chord}</div>
            <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap break-all">
              {tab}
            </pre>
          </div>
        ))}
      </div>
    </aside>
  )
}
