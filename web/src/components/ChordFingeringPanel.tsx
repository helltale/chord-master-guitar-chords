import { useTranslation } from '@/contexts/I18nContext'

interface ChordFingeringPanelProps {
  chordTabs: Record<string, string>
}

const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'] as const

// Явное описание баррэ для конкретных аккордов:
// индексы струн идут с низкой к высокой (E A D G B e) => 0..5.
const BARRE_CHORDS: Record<string, { fret: number; from: number; to: number }> = {
  // Полное баррэ от 6-й до 1-й струны на 1-м ладу
  F: { fret: 1, from: 0, to: 5 },
  // Баррэ от 5-й до 1-й струны на 2-м ладу
  Bm: { fret: 2, from: 1, to: 5 },
}

function parseShape(shape: string): number[] | null {
  const trimmed = shape.trim()
  if (!trimmed || trimmed.length !== 6) return null
  const frets: number[] = []
  for (const ch of trimmed) {
    if (ch === 'x' || ch === 'X') {
      frets.push(-1)
    } else if (ch === '0') {
      frets.push(0)
    } else if (ch >= '1' && ch <= '9') {
      frets.push(Number(ch))
    } else {
      return null
    }
  }
  return frets
}

function buildFretboardGeometry() {
  // SVG coordinate system
  const W = 100
  const H = 100
  const padX = 8
  const padTop = 10
  const padBottom = 10

  // 5 horizontal lines (nut/first line + 4 frets) => 4 fret "cells"
  const fretLines = 5
  const yStep = (H - padTop - padBottom) / (fretLines - 1)
  const yLines = Array.from({ length: fretLines }, (_, i) => padTop + i * yStep)

  const stringCount = STRING_LABELS.length
  const xStep = (W - padX * 2) / (stringCount - 1)
  const xStrings = Array.from({ length: stringCount }, (_, i) => padX + i * xStep)

  return { W, H, yLines, xStrings }
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
        {entries.map(([chord, shape]) => {
          const frets = parseShape(shape)

          // определяем, надо ли показывать номер лада (для баррэ выше 3)
          let baseFret = 1
          let showNut = true
          if (frets) {
            const usedFrets = frets.filter((f) => f > 0)
            if (usedFrets.length > 0) {
              const max = Math.max(...usedFrets)
              const min = Math.min(...usedFrets)
              if (max > 3) {
                baseFret = min
                showNut = false
              }
            }
          }

          return (
            <div
              key={chord}
              className="group flex cursor-pointer flex-col rounded-xl border border-slate-700 bg-slate-900/70 p-3 shadow-sm shadow-black/40 transition-colors hover:border-indigo-400"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-indigo-300">
                  {chord}
                </span>
                {!showNut && frets && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {baseFret}
                  </span>
                )}
              </div>

              {frets ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex h-32 w-24 flex-col justify-center">
                    {/* Fretboard */}
                    <div className="relative flex-1 rounded-md bg-slate-950/80">
                      {(() => {
                        const { W, H, yLines, xStrings } = buildFretboardGeometry()
                        const yTop = yLines[0]
                        const yBottom = yLines[yLines.length - 1]

                        const stringMarkers = frets.map((f) => (f < 0 ? 'x' : f === 0 ? 'o' : ''))

                        type Barre = { fret: number; from: number; to: number }
                        const barreSegments: Barre[] = []

                        // Явная поддержка баррэ для некоторых аккордов (F, Bm и т.п.).
                        const barreDef = BARRE_CHORDS[chord]
                        if (barreDef) {
                          barreSegments.push(barreDef)
                        }

                        const isInBarre = (fret: number, stringIdx: number) =>
                          barreSegments.some(
                            (b) => b.fret === fret && stringIdx >= b.from && stringIdx <= b.to,
                          )

                        return (
                          <svg
                            className="h-full w-full"
                            viewBox={`0 0 ${W} ${H}`}
                            role="img"
                            aria-label={`${chord} chord fingering`}
                          >
                            {/* background (keeps edges crisp on some browsers) */}
                            <rect x="0" y="0" width={W} height={H} rx="8" fill="transparent" />

                            {/* open / muted markers directly над соответствующими струнами */}
                            {stringMarkers.map((mark, idx) =>
                              mark ? (
                                <text
                                  key={`m-${idx}`}
                                  x={xStrings[idx]}
                                  y={yTop - 4}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fill="rgb(203 213 225)" /* slate-300 */
                                >
                                  {mark}
                                </text>
                              ) : null,
                            )}

                            {/* strings */}
                            {xStrings.map((x) => (
                              <line
                                key={`s-${x}`}
                                x1={x}
                                x2={x}
                                y1={yTop}
                                y2={yBottom}
                                stroke="rgb(51 65 85)" /* slate-700 */
                                strokeWidth="1"
                                shapeRendering="geometricPrecision"
                              />
                            ))}

                            {/* nut + frets */}
                            {yLines.map((y, idx) => (
                              <line
                                key={`f-${y}`}
                                x1={xStrings[0]}
                                x2={xStrings[xStrings.length - 1]}
                                y1={y}
                                y2={y}
                                stroke={idx === 0 && showNut ? 'rgb(226 232 240)' : 'rgb(30 41 59)'} /* slate-200 / slate-800 */
                                strokeWidth={idx === 0 && showNut ? 4 : 1}
                                strokeLinecap="round"
                                shapeRendering="geometricPrecision"
                              />
                            ))}

                            {/* подпись номера лада рядом с баррэ (для баррэ не с первого лада) */}
                            {Array.from(new Set(barreSegments.map((b) => b.fret)))
                              .filter((fret) => fret > 1)
                              .map((fret) => {
                                const rowIndex = Math.max(1, Math.min(4, fret - baseFret + 1))
                                const y = (yLines[rowIndex - 1] + yLines[rowIndex]) / 2
                                return (
                                  <text
                                    key={`barre-label-${fret}`}
                                    x={W - 4}
                                    y={y + 3}
                                    textAnchor="end"
                                    fontSize="9"
                                    fill="rgb(148 163 184)" /* slate-400 */
                                  >
                                    {fret}
                                  </text>
                                )
                              })}

                            {/* баррэ (один палец на нескольких струнах) */}
                            {barreSegments.map((b) => {
                              const rowIndex = Math.max(1, Math.min(4, b.fret - baseFret + 1))
                              const y = (yLines[rowIndex - 1] + yLines[rowIndex]) / 2
                              const xStart = xStrings[b.from]
                              const xEnd = xStrings[b.to]
                              const barHeight = 10
                              const paddingX = 5

                              return (
                                <rect
                                  key={`barre-${b.fret}-${b.from}-${b.to}`}
                                  x={xStart - paddingX}
                                  y={y - barHeight / 2}
                                  width={xEnd - xStart + paddingX * 2}
                                  height={barHeight}
                                  rx={barHeight / 2}
                                  fill="rgb(165 180 252)" /* indigo-300 */
                                  filter="drop-shadow(0px 0px 8px rgba(129,140,248,0.95))"
                                />
                              )
                            })}

                            {/* finger dots */}
                            {frets.map((fret, stringIdx) => {
                              if (fret <= 0 || isInBarre(fret, stringIdx)) return null
                              const rowIndex = Math.max(1, Math.min(4, fret - baseFret + 1))
                              const y = (yLines[rowIndex - 1] + yLines[rowIndex]) / 2
                              const x = xStrings[stringIdx]
                              return (
                                <circle
                                  key={`${stringIdx}-${fret}`}
                                  cx={x}
                                  cy={y}
                                  r="5.5"
                                  fill="rgb(165 180 252)" /* indigo-300 */
                                  filter="drop-shadow(0px 0px 6px rgba(129,140,248,0.9))"
                                />
                              )
                            })}
                          </svg>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="max-h-28 overflow-y-auto whitespace-pre-wrap break-all rounded-lg bg-slate-950/70 p-2 font-mono text-[11px] text-slate-100 custom-scrollbar">
                  {shape}
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
