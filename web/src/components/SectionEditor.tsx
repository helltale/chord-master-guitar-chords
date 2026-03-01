import type { Section, Block } from '@/api/schemas'
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
    <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`section-label-${sectionIndex}`}>
          Название секции
        </label>
        <input
          id={`section-label-${sectionIndex}`}
          type="text"
          value={section.label ?? ''}
          onChange={(e) => onChange({ ...section, label: e.target.value })}
          placeholder="Куплет 1, Припев..."
          className="rounded border border-gray-300 px-2 py-1 text-lg font-semibold text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {onRemoveSection && (
          <button
            type="button"
            onClick={onRemoveSection}
            className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            Удалить секцию
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
              className="absolute -top-1 right-0 rounded px-1 text-xs text-gray-400 hover:text-red-600"
            >
              Удалить строку
            </button>
          )}
        </div>
      ))}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handleAddLine}
          className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          + Строка
        </button>
        {onAddSectionAfter && (
          <button
            type="button"
            onClick={onAddSectionAfter}
            className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            + Секция
          </button>
        )}
      </div>
    </section>
  )
}
