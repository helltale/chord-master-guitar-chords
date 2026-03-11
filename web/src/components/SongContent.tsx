import type { TabContent as TabContentType } from '@/api/schemas'

interface SongContentProps {
  content: TabContentType
}

export function SongContent({ content }: SongContentProps) {
  const sections = content.sections ?? []
  return (
    <article className="max-w-none text-gray-800 dark:text-gray-200">
      {sections.map((section, idx) => (
        <section key={idx} className="mb-10">
          {section.label && (
            <h3 className="mb-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-300">
              {section.label}
            </h3>
          )}
          {(section.blocks ?? []).map((block, bidx) => (
            <div key={bidx} className="mb-6">
              {block.kind === 'lyrics' && (
                <div className="space-y-4 font-sans leading-relaxed text-gray-100">
                  {(block.segments ?? []).map((seg, sidx) => (
                    <span
                      key={sidx}
                      className="inline-block min-w-[0.25rem] align-top"
                    >
                      <span className="mb-1 block whitespace-nowrap text-xs font-mono font-semibold text-emerald-300">
                        {seg.chord ? (
                          <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[0.65rem] text-emerald-300 shadow-sm shadow-indigo-900/30">
                            {seg.chord}
                          </span>
                        ) : (
                          '\u00A0'
                        )}
                      </span>
                      <span className="whitespace-pre-wrap break-words text-base text-slate-100">
                        {seg.text ?? ''}
                      </span>
                    </span>
                  ))}
                </div>
              )}
              {block.kind === 'instrumental' && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 text-sm text-gray-200 dark:border-indigo-400/40 dark:bg-indigo-900/20">
                  {block.label && (
                    <span className="mb-1 block font-semibold uppercase tracking-wide text-indigo-300">
                      {block.label}
                    </span>
                  )}
                  {block.chords && block.chords.length > 0 && (
                    <p className="font-mono text-sm text-emerald-200">
                      {(block.chords ?? []).join(' ')}
                    </p>
                  )}
                  {block.tab && (
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950/60 p-3 text-xs text-gray-100">
                      {block.tab}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}
    </article>
  )
}
