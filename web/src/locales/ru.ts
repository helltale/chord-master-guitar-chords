import type { LocaleDict } from './keys'

export const ru: LocaleDict = {
  'common.loading': 'Загрузка...',
  'common.error': 'Ошибка',
  'common.backToHome': 'На главную',
  'common.songNotFound': 'Песня не найдена',
  'common.artistNotFound': 'Артист не найден',
  'common.noContent': 'Нет контента',
  'common.found': 'Найдено',
  'common.nothingFound': 'Ничего не найдено',

  'header.appName': 'AmDm Guitar Chords',
  'header.lightTheme': 'Светлая тема',
  'header.darkTheme': 'Тёмная тема',
  'header.lightThemeAria': 'Включить светлую тему',
  'header.darkThemeAria': 'Включить тёмную тему',
  'header.createArtist': 'Создать артиста',
  'header.createSong': 'Создать песню',

  'search.label': 'Поиск исполнителей и произведений',
  'search.placeholder': 'Поиск...',

  'song.tonality': 'Тональность',

  'artist.songs': 'Песни',
  'artist.noSongs': 'Нет песен',

  'createSong.title': 'Создать песню',
  'createSong.artist': 'Артист',
  'createSong.selectArtist': 'Выберите артиста',
  'createSong.songTitle': 'Название',
  'createSong.slug': 'Адрес страницы',
  'createSong.tonalityOptional': 'Тональность (число, опционально)',
  'createSong.lyricsOptional': 'Текст с аккордами (опционально)',
  'createSong.submit': 'Создать песню',
  'createSong.submitting': 'Создание...',

  'createArtist.title': 'Создать артиста',
  'createArtist.name': 'Имя',
  'createArtist.slug': 'Адрес страницы',
  'createArtist.submit': 'Создать артиста',
  'createArtist.submitting': 'Создание...',

  'section.sectionLabel': 'Название секции',
  'section.placeholder': 'Куплет 1, Припев...',
  'section.removeSection': 'Удалить секцию',
  'section.removeLine': 'Удалить строку',
  'section.addLine': '+ Строка',
  'section.addSection': '+ Секция',

  'segment.selectChord': 'Выбрать аккорд',
  'segment.textPlaceholder': 'текст',
  'segment.insertChordTitle': 'Вставить аккорд здесь (или Ctrl+Enter в поле текста)',
  'segment.insertChordAria': 'Вставить аккорд здесь',

  'lyricsEditor.hint':
    'Редактор: клик по аккорду — изменить, кнопка ⊕ или Ctrl+Enter в тексте — вставить аккорд здесь.',
  'lyricsEditor.pasteFromText': 'Вставить из текста',
  'lyricsEditor.importTitle': 'Вставить из текста',
  'lyricsEditor.importHint':
    'Вставьте текст в формате [Am] слова [C] ещё слова. Строка «Припев:» или «Куплет 1:» начинает новую секцию.',
  'lyricsEditor.importPlaceholder': '[F] Улетают мысли, [Dm] тянутся [Am] за горизонт...',
  'lyricsEditor.cancel': 'Отмена',
  'lyricsEditor.apply': 'Применить',

  'chordPicker.label': 'Выбор аккорда',
  'chordPicker.otherLabel': 'Другой аккорд',
  'chordPicker.otherPlaceholder': 'Другой...',

  'lyricsBlock.removeSegment': 'Удалить сегмент',
  'lyricsBlock.addSegment': '+ Сегмент',

  'transpose.label': 'Транспонировать:',

  'chordPanel.title': 'Аппликатуры аккордов',
}
