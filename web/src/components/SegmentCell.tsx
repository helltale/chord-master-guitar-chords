import { useState, useRef } from 'react'
import type { ChordSegment } from '@/api/schemas'
import { ChordPicker } from './ChordPicker'

interface SegmentCellProps {
  segmentIndex: number
  segment: ChordSegment
  onChange: (seg: ChordSegment) => void
  onSplitAtCursor: (segmentIndex: number, offset: number) => void
}

export function SegmentCell({
  segmentIndex,
  segment,
  onChange,
  onSplitAtCursor,
}: SegmentCellProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSplitHere = () => {
    const input = inputRef.current
    const offset = input ? input.selectionStart ?? 0 : 0
    onSplitAtCursor(segmentIndex, offset)
  }

  return (
    <span className="relative inline-block align-top min-w-[2rem]">
      <button
        type="button"
        onClick={() => setPickerOpen((o) => !o)}
        className="block w-full text-left text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap mb-0.5 rounded px-0.5 py-0.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 min-h-[1.25rem]"
        aria-label="Выбрать аккорд"
      >
        {segment.chord || '—'}
      </button>
      {pickerOpen && (
        <ChordPicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          value={segment.chord}
          onSelect={(chord) => {
            onChange({ ...segment, chord })
            setPickerOpen(false)
          }}
        />
      )}
      <input
        ref={inputRef}
        type="text"
        value={segment.text ?? ''}
        onChange={(e) => onChange({ ...segment, text: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handleSplitHere()
          }
        }}
        className="block w-full min-w-[3rem] rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-1 py-0.5 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="текст"
      />
      <button
        type="button"
        onClick={handleSplitHere}
        className="absolute -right-1 top-1/2 -translate-y-1/2 rounded bg-gray-100 dark:bg-gray-600 px-1 py-0.5 text-xs text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300"
        title="Вставить аккорд здесь (или Ctrl+Enter в поле текста)"
        aria-label="Вставить аккорд здесь"
      >
        ⊕
      </button>
    </span>
  )
}
