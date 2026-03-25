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
  | 'header.nav.artists'
  | 'header.nav.songs'
  | 'header.nav.favorites'
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
  | 'artist.follow'
  | 'artist.share'
  // Create song form
  | 'createSong.title'
  | 'createSong.artist'
  | 'createSong.selectArtist'
  | 'createSong.songTitle'
  | 'createSong.tonalityOptional'
  | 'createSong.lyricsOptional'
  | 'createSong.submit'
  | 'createSong.submitting'
  | 'createSong.subtitle'
  | 'createSong.previewTitle'
  | 'createSong.previewText'
  | 'createSong.statusConnected'
  | 'createSong.statusDraft'
  | 'createSong.tipSyntax'
  // Create artist form
  | 'createArtist.title'
  | 'createArtist.name'
  | 'createArtist.submit'
  | 'createArtist.submitting'
  | 'createArtist.subtitle'
  | 'createArtist.tipSyncTitle'
  | 'createArtist.tipSyncText'
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
  // Home page hero & search
  | 'home.heroTitleLine1'
  | 'home.heroTitleLine2'
  | 'home.heroSubtitle'
  | 'home.trendingTitle'
  | 'home.trendingSubtitle'
  | 'home.recentlyAddedTitle'
  | 'home.recentlyAddedSubtitle'
  | 'home.topResultsTitle'
  // Extended search helpers
  | 'search.helper'
  | 'search.topMatches'
  | 'search.noArtists'
  | 'search.noSongs'
  // Common extras
  | 'common.view'
  | 'common.favorite'
  | 'common.share'
  // Transpose extras
  | 'transpose.original'
  | 'transpose.down'
  | 'transpose.up'
  // Player controls
  | 'player.previous'
  | 'player.play'
  | 'player.next'
  | 'player.settings'

export type LocaleDict = Record<LocaleKey, string>
