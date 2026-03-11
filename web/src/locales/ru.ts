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

  'header.appName': 'ChordMaster',
  'header.lightTheme': 'Светлая тема',
  'header.darkTheme': 'Тёмная тема',
  'header.lightThemeAria': 'Включить светлую тему',
  'header.darkThemeAria': 'Включить тёмную тему',
  'header.createArtist': 'Создать артиста',
  'header.createSong': 'Создать песню',
  'header.nav.artists': 'Артисты',
  'header.nav.songs': 'Песни',
  'header.nav.favorites': 'Избранное',

  'search.label': 'Поиск исполнителей и произведений',
  'search.placeholder': 'Поиск...',
  'search.artists': 'Исполнители',
  'search.songs': 'Песни',
  'search.artistFoundForQuery': 'По запросу «{query}» найден исполнитель',

  'song.tonality': 'Тональность',

  'artist.songs': 'Песни',
  'artist.noSongs': 'Нет песен',
  'artist.follow': 'Подписаться',
  'artist.share': 'Поделиться',

  'createSong.title': 'Создать песню',
  'createSong.artist': 'Артист',
  'createSong.selectArtist': 'Выберите артиста',
  'createSong.songTitle': 'Название',
  'createSong.slug': 'Адрес страницы',
  'createSong.tonalityOptional': 'Тональность (число, опционально)',
  'createSong.lyricsOptional': 'Текст с аккордами (опционально)',
  'createSong.submit': 'Создать песню',
  'createSong.submitting': 'Создание...',
  'createSong.subtitle':
    'Выберите артиста, задайте название и числовую тональность (в полутонах). Редактор текста помогает расположить аккорды над словами.',
  'createSong.previewTitle': 'Как это будет выглядеть',
  'createSong.previewText':
    'После сохранения песня откроется в основном просмотрщике: аккорды над строками текста и панель аппликатур сбоку.',
  'createSong.statusConnected': 'Подключено',
  'createSong.statusDraft': 'Черновик песни',
  'createSong.tipSyntax':
    'Вставляйте аккорды в квадратных скобках внутри текста, например [Am], чтобы при импорте они автоматически встали над нужными словами.',

  'createArtist.title': 'Создать артиста',
  'createArtist.name': 'Имя',
  'createArtist.slug': 'Адрес страницы',
  'createArtist.submit': 'Создать артиста',
  'createArtist.submitting': 'Создание...',
  'createArtist.subtitle':
    'Добавьте нового артиста в библиотеку аккордов. Имя и slug определяют, как он будет отображаться и по какому адресу открываться.',
  'createArtist.tipSyncTitle': 'Автоматическая связка',
  'createArtist.tipSyncText':
    'Данные артиста автоматически связываются со всеми его песнями, поэтому имя и slug можно менять в одном месте.',
  'createArtist.tipSlugTitle': 'Аккуратные ссылки',
  'createArtist.tipSlugText':
    'Slug попадает в адрес вида /artist/my-artist. Используйте только латиницу, цифры и дефисы в нижнем регистре.',

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

  'home.heroTitleLine1': 'Каждый аккорд, каждая нота.',
  'home.heroTitleLine2': 'Освой любимые песни.',
  'home.heroSubtitle':
    'Ищи исполнителей, песни и табулатуры. Меньше времени на разбор аккордов — больше на игру.',
  'home.trendingTitle': 'Популярные песни',
  'home.trendingSubtitle':
    'Начните набирать запрос выше — мы покажем самые релевантные песни и исполнителей.',
  'home.recentlyAddedTitle': 'Недавно добавленные',
  'home.recentlyAddedSubtitle':
    'Новые песни, которые вы добавите, появятся здесь. Используйте кнопки «Создать артиста» и «Создать песню» в шапке.',
  'home.topResultsTitle': 'Лучшее совпадение',

  'search.helper': 'Введите имя исполнителя, песню или аккорд, чтобы начать.',
  'search.topMatches': 'Лучшие совпадения ниже',
  'search.noArtists': 'По этому запросу пока нет исполнителей.',
  'search.noSongs': 'По этому запросу пока нет песен.',

  'common.view': 'Открыть',
  'common.favorite': 'В избранное',
  'common.share': 'Поделиться',

  'transpose.original': 'Оригинал',
  'transpose.down': 'Транспонировать ниже',
  'transpose.up': 'Транспонировать выше',

  'player.previous': 'Предыдущая песня',
  'player.play': 'Воспроизвести',
  'player.next': 'Следующая песня',
  'player.settings': 'Настройки плеера',
}
