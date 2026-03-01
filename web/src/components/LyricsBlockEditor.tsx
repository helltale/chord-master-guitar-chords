import type { Block, ChordSegment } from '@/api/schemas'
import { SegmentCell } from './SegmentCell'

interface LyricsBlockEditorProps {
  block: Block
  blockIndex: number
  onChange: (block: Block) => void
}

function ensureLyricsBlock(block: Block): Block {
  if (block.kind === 'lyrics' && Array.isArray(block.segments) && block.segments.length > 0) {
    return block
  }
  return { kind: 'lyrics', segments: [{ chord: '', text: '' }] }
}

export function LyricsBlockEditor({ block, blockIndex: _blockIndex, onChange }: LyricsBlockEditorProps) {
  const b = ensureLyricsBlock(block)
  const segments = b.segments ?? []

  const updateSegments = (next: ChordSegment[]) => {
    onChange({ ...b, segments: next })
  }

  const handleSegmentChange = (index: number, seg: ChordSegment) => {
    const next = [...segments]
    next[index] = seg
    updateSegments(next)
  }

  const handleSplitAtCursor = (segmentIndex: number, offset: number) => {
    const seg = segments[segmentIndex]
    if (!seg) return
    const text = seg.text ?? ''
    const before = text.slice(0, offset)
    const after = text.slice(offset)
    const next = [...segments]
    next[segmentIndex] = { ...seg, text: before }
    next.splice(segmentIndex + 1, 0, { chord: '', text: after })
    updateSegments(next)
  }

  const handleAddSegment = () => {
    updateSegments([...segments, { chord: '', text: '' }])
  }

  const handleRemoveSegment = (index: number) => {
    if (segments.length <= 1) {
      updateSegments([{ chord: '', text: '' }])
      return
    }
    const next = segments.filter((_, i) => i !== index)
    updateSegments(next)
  }

  return (
    <div className="mb-4 flex flex-wrap items-start gap-1 font-mono text-gray-800 leading-relaxed">
      {segments.map((seg, sidx) => (
        <span key={sidx} className="inline-flex items-start gap-0.5">
          <SegmentCell
            segmentIndex={sidx}
            segment={seg}
            onChange={(s) => handleSegmentChange(sidx, s)}
            onSplitAtCursor={handleSplitAtCursor}
          />
          {segments.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveSegment(sidx)}
              className="mt-1.5 rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Удалить сегмент"
              aria-label="Удалить сегмент"
            >
              ×
            </button>
          )}
        </span>
      ))}
      <button
        type="button"
        onClick={handleAddSegment}
        className="mt-1.5 rounded border border-dashed border-gray-300 px-2 py-1 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
      >
        + Сегмент
      </button>
    </div>
  )
}
