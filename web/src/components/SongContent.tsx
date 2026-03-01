import type { TabContent as TabContentType } from '@/api/schemas'

interface SongContentProps {
  content: TabContentType
}

export function SongContent({ content }: SongContentProps) {
  const sections = content.sections ?? []
  return (
    <article className="prose prose-gray max-w-none">
      {sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          {section.label && (
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {section.label}
            </h3>
          )}
          {(section.blocks ?? []).map((block, bidx) => (
            <div key={bidx} className="mb-4">
              {block.kind === 'lyrics' && (
                <div className="font-mono text-gray-800 whitespace-pre-wrap">
                  {(block.segments ?? []).map((seg, sidx) => (
                    <span key={sidx}>
                      {seg.chord && (
                        <span className="font-semibold text-indigo-600 mr-1">
                          [{seg.chord}]
                        </span>
                      )}
                      {seg.text ?? ''}
                    </span>
                  ))}
                </div>
              )}
              {block.kind === 'instrumental' && (
                <div className="text-gray-600">
                  {block.label && (
                    <span className="font-medium block mb-1">{block.label}</span>
                  )}
                  {block.chords && block.chords.length > 0 && (
                    <p className="font-mono text-sm">
                      {(block.chords ?? []).join(' ')}
                    </p>
                  )}
                  {block.tab && (
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-1">
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
