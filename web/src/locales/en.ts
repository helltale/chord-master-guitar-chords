import type { LocaleDict } from './keys'

export const en: LocaleDict = {
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.backToHome': 'Back to home',
  'common.songNotFound': 'Song not found',
  'common.artistNotFound': 'Artist not found',
  'common.noContent': 'No content',
  'common.found': 'Found',
  'common.nothingFound': 'Nothing found',

  'header.appName': 'AmDm Guitar Chords',
  'header.lightTheme': 'Light theme',
  'header.darkTheme': 'Dark theme',
  'header.lightThemeAria': 'Switch to light theme',
  'header.darkThemeAria': 'Switch to dark theme',
  'header.createArtist': 'Create artist',
  'header.createSong': 'Create song',

  'search.label': 'Search artists and songs',
  'search.placeholder': 'Search...',

  'song.tonality': 'Key',

  'artist.songs': 'Songs',
  'artist.noSongs': 'No songs',

  'createSong.title': 'Create song',
  'createSong.artist': 'Artist',
  'createSong.selectArtist': 'Select artist',
  'createSong.songTitle': 'Title',
  'createSong.slug': 'Slug',
  'createSong.tonalityOptional': 'Key (number, optional)',
  'createSong.lyricsOptional': 'Lyrics with chords (optional)',
  'createSong.submit': 'Create song',
  'createSong.submitting': 'Creating...',

  'createArtist.title': 'Create artist',
  'createArtist.name': 'Name',
  'createArtist.slug': 'Slug',
  'createArtist.submit': 'Create artist',
  'createArtist.submitting': 'Creating...',

  'section.sectionLabel': 'Section name',
  'section.placeholder': 'Verse 1, Chorus...',
  'section.removeSection': 'Remove section',
  'section.removeLine': 'Remove line',
  'section.addLine': '+ Line',
  'section.addSection': '+ Section',

  'segment.selectChord': 'Select chord',
  'segment.textPlaceholder': 'text',
  'segment.insertChordTitle': 'Insert chord here (or Ctrl+Enter in text field)',
  'segment.insertChordAria': 'Insert chord here',

  'lyricsEditor.hint':
    'Editor: click on chord to edit, ⊕ button or Ctrl+Enter in text — insert chord here.',
  'lyricsEditor.pasteFromText': 'Paste from text',
  'lyricsEditor.importTitle': 'Paste from text',
  'lyricsEditor.importHint':
    'Paste text in format [Am] words [C] more words. Line "Chorus:" or "Verse 1:" starts a new section.',
  'lyricsEditor.importPlaceholder': '[F] Thoughts fly away, [Dm] stretch [Am] beyond the horizon...',
  'lyricsEditor.cancel': 'Cancel',
  'lyricsEditor.apply': 'Apply',

  'chordPicker.label': 'Chord picker',
  'chordPicker.otherLabel': 'Other chord',
  'chordPicker.otherPlaceholder': 'Other...',

  'lyricsBlock.removeSegment': 'Remove segment',
  'lyricsBlock.addSegment': '+ Segment',

  'transpose.label': 'Transpose:',

  'chordPanel.title': 'Chord fingerings',
}
