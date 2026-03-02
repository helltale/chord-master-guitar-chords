/**
 * All localization keys. Use these with t() for type-safe translations.
 */
export type LocaleKey =
  // Common
  | 'common.loading'
  | 'common.error'
  | 'common.backToHome'
  | 'common.songNotFound'
  | 'common.artistNotFound'
  | 'common.noContent'
  | 'common.found'
  | 'common.nothingFound'
  // Header
  | 'header.appName'
  | 'header.lightTheme'
  | 'header.darkTheme'
  | 'header.lightThemeAria'
  | 'header.darkThemeAria'
  | 'header.createArtist'
  | 'header.createSong'
  // Search
  | 'search.label'
  | 'search.placeholder'
  | 'search.artists'
  | 'search.songs'
  | 'search.artistFoundForQuery'
  // Song page
  | 'song.tonality'
  // Artist page
  | 'artist.songs'
  | 'artist.noSongs'
  // Create song form
  | 'createSong.title'
  | 'createSong.artist'
  | 'createSong.selectArtist'
  | 'createSong.songTitle'
  | 'createSong.slug'
  | 'createSong.tonalityOptional'
  | 'createSong.lyricsOptional'
  | 'createSong.submit'
  | 'createSong.submitting'
  // Create artist form
  | 'createArtist.title'
  | 'createArtist.name'
  | 'createArtist.slug'
  | 'createArtist.submit'
  | 'createArtist.submitting'
  // Section editor
  | 'section.sectionLabel'
  | 'section.placeholder'
  | 'section.removeSection'
  | 'section.removeLine'
  | 'section.addLine'
  | 'section.addSection'
  // Segment cell
  | 'segment.selectChord'
  | 'segment.textPlaceholder'
  | 'segment.insertChordTitle'
  | 'segment.insertChordAria'
  // Lyrics WYSIWYG
  | 'lyricsEditor.hint'
  | 'lyricsEditor.pasteFromText'
  | 'lyricsEditor.importTitle'
  | 'lyricsEditor.importHint'
  | 'lyricsEditor.importPlaceholder'
  | 'lyricsEditor.cancel'
  | 'lyricsEditor.apply'
  // Chord picker
  | 'chordPicker.label'
  | 'chordPicker.otherLabel'
  | 'chordPicker.otherPlaceholder'
  // Lyrics block editor
  | 'lyricsBlock.removeSegment'
  | 'lyricsBlock.addSegment'
  // Transpose
  | 'transpose.label'
  // Chord panel
  | 'chordPanel.title'

export type LocaleDict = Record<LocaleKey, string>
