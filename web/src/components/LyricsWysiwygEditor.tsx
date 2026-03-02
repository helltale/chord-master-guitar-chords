import { useState, useCallback, useEffect } from 'react'
import type { TabContent, Section } from '@/api/schemas'
import { parseLyricsWithChords } from '@/utils/parseLyricsWithChords'
import { SectionEditor } from './SectionEditor'

const EMPTY_SECTION: Section = {
  type: 'verse',
  label: '',
  blocks: [{ kind: 'lyrics', segments: [{ chord: '', text: '' }] }],
}

function emptyContent(): TabContent {
  return { sections: [{ ...EMPTY_SECTION }] }
}

interface LyricsWysiwygEditorProps {
  value: TabContent
  onChange: (content: TabContent) => void
}

export function LyricsWysiwygEditor({ value, onChange }: LyricsWysiwygEditorProps) {
  const [content, setContent] = useState<TabContent>(() =>
    value.sections?.length ? value : emptyContent()
  )

  useEffect(() => {
    if (value.sections?.length) {
      setContent(value)
    }
  }, [value])

  const notify = useCallback(
    (next: TabContent) => {
      setContent(next)
      onChange(next)
    },
    [onChange]
  )

  const updateSection = useCallback(
    (sectionIndex: number, section: Section) => {
      const sections = [...(content.sections ?? [])]
      sections[sectionIndex] = section
      notify({ ...content, sections })
    },
    [content, notify]
  )

  const addSectionAfter = useCallback(
    (sectionIndex: number) => {
      const sections = [...(content.sections ?? [])]
      const newSection: Section = {
        type: 'verse',
        label: '',
        blocks: [{ kind: 'lyrics', segments: [{ chord: '', text: '' }] }],
      }
      sections.splice(sectionIndex + 1, 0, newSection)
      notify({ ...content, sections })
    },
    [content, notify]
  )

  const removeSection = useCallback(
    (sectionIndex: number) => {
      const sections = (content.sections ?? []).filter((_, i) => i !== sectionIndex)
      notify({ ...content, sections: sections.length ? sections : [EMPTY_SECTION] })
    },
    [content, notify]
  )

  const addSection = useCallback(() => {
    const sections = [...(content.sections ?? []), { ...EMPTY_SECTION }]
    notify({ ...content, sections })
  }, [content, notify])

  const sections = content.sections ?? []
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')

  const handleImportApply = () => {
    const parsed = parseLyricsWithChords(importText)
    notify(parsed.sections?.length ? parsed : emptyContent())
    setImportOpen(false)
    setImportText('')
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Редактор: клик по аккорду — изменить, кнопка ⊕ или Ctrl+Enter в тексте — вставить аккорд
        здесь.
      </p>
      <button
        type="button"
        onClick={() => setImportOpen(true)}
        className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        Вставить из текста
      </button>
      {importOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-dialog-title"
        >
          <div className="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 p-4 shadow-xl">
            <h2 id="import-dialog-title" className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
              Вставить из текста
            </h2>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Вставьте текст в формате [Am] слова [C] ещё слова. Строка «Припев:» или «Куплет 1:»
              начинает новую секцию.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={8}
              className="mb-4 w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="[F] Улетают мысли, [Dm] тянутся [Am] за горизонт..."
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setImportOpen(false)
                  setImportText('')
                }}
                className="rounded border border-gray-300 dark:border-gray-600 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleImportApply}
                className="rounded bg-indigo-600 dark:bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
      {sections.map((section, idx) => (
        <SectionEditor
          key={idx}
          section={section}
          sectionIndex={idx}
          onChange={(s) => updateSection(idx, s)}
          onAddSectionAfter={() => addSectionAfter(idx)}
          onRemoveSection={sections.length > 1 ? () => removeSection(idx) : undefined}
        />
      ))}
      <button
        type="button"
        onClick={addSection}
        className="rounded border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        + Секция
      </button>
    </div>
  )
}

