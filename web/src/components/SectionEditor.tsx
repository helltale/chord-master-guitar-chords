import type { Section, Block } from '@/api/schemas'
import { useTranslation } from '@/contexts/I18nContext'
import { LyricsBlockEditor } from './LyricsBlockEditor'

interface SectionEditorProps {
  section: Section
  sectionIndex: number
  onChange: (section: Section) => void
  onAddSectionAfter?: () => void
  onRemoveSection?: () => void
}

const emptyLyricsBlock: Block = {
  kind: 'lyrics',
  segments: [{ chord: '', text: '' }],
}

export function SectionEditor({
  section,
  sectionIndex,
  onChange,
  onAddSectionAfter,
  onRemoveSection,
}: SectionEditorProps) {
  const { t } = useTranslation()
  const blocks = section.blocks ?? []

  const updateBlocks = (next: Block[]) => {
    onChange({ ...section, blocks: next })
  }

  const handleBlockChange = (blockIndex: number, block: Block) => {
    const next = [...blocks]
    next[blockIndex] = block
    updateBlocks(next)
  }

  const handleAddLine = () => {
    updateBlocks([...blocks, { ...emptyLyricsBlock }])
  }

  const handleRemoveBlock = (blockIndex: number) => {
    if (blocks.length <= 1) return
    const next = blocks.filter((_, i) => i !== blockIndex)
    updateBlocks(next)
  }

  return (
    <section className="mb-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`section-label-${sectionIndex}`}>
          {t('section.sectionLabel')}
        </label>
        <input
          id={`section-label-${sectionIndex}`}
          type="text"
          value={section.label ?? ''}
          onChange={(e) => onChange({ ...section, label: e.target.value })}
          placeholder={t('section.placeholder')}
          className="rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-lg font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {onRemoveSection && (
          <button
            type="button"
            onClick={onRemoveSection}
            className="rounded px-2 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
          >
            {t('section.removeSection')}
          </button>
        )}
      </div>
      {blocks.map((block, bidx) => (
        <div key={bidx} className="relative">
          <LyricsBlockEditor
            block={block}
            blockIndex={bidx}
            onChange={(b) => handleBlockChange(bidx, b)}
          />
          {blocks.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveBlock(bidx)}
              className="absolute -top-1 right-0 rounded px-1 text-xs text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
            >
              {t('section.removeLine')}
            </button>
          )}
        </div>
      ))}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handleAddLine}
          className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          {t('section.addLine')}
        </button>
        {onAddSectionAfter && (
          <button
            type="button"
            onClick={onAddSectionAfter}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {t('section.addSection')}
          </button>
        )}
      </div>
    </section>
  )
}
