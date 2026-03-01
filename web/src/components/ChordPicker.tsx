import { useRef, useEffect } from 'react'
import { COMMON_CHORDS } from '@/api/schemas'

interface ChordPickerProps {
  isOpen: boolean
  onClose: () => void
  value: string
  onSelect: (chord: string) => void
}

export function ChordPicker({ isOpen, onClose, value, onSelect }: ChordPickerProps) {
  const customInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && customInputRef.current) {
      customInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 z-20 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
      role="listbox"
      aria-label="Выбор аккорда"
    >
      <div className="mb-2 grid grid-cols-4 gap-1">
        {COMMON_CHORDS.map((chord) => (
          <button
            key={chord}
            type="button"
            role="option"
            className={`rounded px-2 py-1 text-sm font-medium hover:bg-indigo-50 ${
              value === chord ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700'
            }`}
            onClick={() => {
              onSelect(chord)
              onClose()
            }}
          >
            {chord}
          </button>
        ))}
      </div>
      <div className="flex gap-1 border-t border-gray-100 pt-2">
        <label className="sr-only" htmlFor="chord-picker-custom">
          Другой аккорд
        </label>
        <input
          id="chord-picker-custom"
          ref={customInputRef}
          type="text"
          placeholder="Другой..."
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = (e.currentTarget.value || '').trim()
              if (v) {
                onSelect(v)
                onClose()
              }
            }
            if (e.key === 'Escape') onClose()
          }}
        />
        <button
          type="button"
          className="rounded bg-indigo-600 px-2 py-1 text-sm text-white hover:bg-indigo-700"
          onClick={() => {
            const v = customInputRef.current?.value?.trim()
            if (v) {
              onSelect(v)
              onClose()
            }
          }}
        >
          OK
        </button>
      </div>
    </div>
  )
}
