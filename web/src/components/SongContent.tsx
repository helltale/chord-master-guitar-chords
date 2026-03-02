import type { TabContent as TabContentType } from '@/api/schemas'

interface SongContentProps {
  content: TabContentType
}

export function SongContent({ content }: SongContentProps) {
  const sections = content.sections ?? []
  return (
    <article className="max-w-none text-gray-800 dark:text-gray-200">
      {sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          {section.label && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {section.label}
            </h3>
          )}
          {(section.blocks ?? []).map((block, bidx) => (
            <div key={bidx} className="mb-4">
              {block.kind === 'lyrics' && (
                <div className="font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
                  {(block.segments ?? []).map((seg, sidx) => (
                    <span
                      key={sidx}
                      className="inline-block align-top min-w-[0.25rem]"
                    >
                      <span className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap mb-0.5">
                        {seg.chord || '\u00A0'}
                      </span>
                      <span className="whitespace-pre-wrap break-words">
                        {seg.text ?? ''}
                      </span>
                    </span>
                  ))}
                </div>
              )}
              {block.kind === 'instrumental' && (
                <div className="text-gray-600 dark:text-gray-400">
                  {block.label && (
                    <span className="font-medium block mb-1">{block.label}</span>
                  )}
                  {block.chords && block.chords.length > 0 && (
                    <p className="font-mono text-sm">
                      {(block.chords ?? []).join(' ')}
                    </p>
                  )}
                  {block.tab && (
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto mt-1 text-gray-800 dark:text-gray-200">
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
