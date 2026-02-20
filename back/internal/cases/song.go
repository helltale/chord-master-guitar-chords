package cases

import (
	"context"
	"errors"
	"strings"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
)

type SongCases struct {
	artistRepo repository.ArtistRepository
	songRepo   repository.SongRepository
}

func NewSongCases(artistRepo repository.ArtistRepository, songRepo repository.SongRepository) *SongCases {
	return &SongCases{artistRepo: artistRepo, songRepo: songRepo}
}

func (c *SongCases) ListByArtistID(ctx context.Context, artistID uint) ([]*entity.Song, error) {
	return c.songRepo.ListByArtistID(ctx, artistID)
}

func (c *SongCases) List(ctx context.Context, artistID *uint, limit, offset int) ([]*entity.Song, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return c.songRepo.List(ctx, artistID, limit, offset)
}

func (c *SongCases) GetByID(ctx context.Context, id uint) (*entity.Song, error) {
	return c.songRepo.GetByID(ctx, id)
}

func (c *SongCases) Create(ctx context.Context, artistID uint, title, slug string, tonality int, content entity.TabContent) (*entity.Song, error) {
	title = strings.TrimSpace(title)
	slug = strings.TrimSpace(strings.ToLower(slug))
	if title == "" {
		return nil, errors.New("title is required")
	}
	if slug == "" {
		return nil, errors.New("slug is required")
	}
	if !slugRegex.MatchString(slug) {
		return nil, errors.New("slug must be lowercase alphanumeric with hyphens or underscores")
	}
	_, err := c.artistRepo.GetByID(ctx, artistID)
	if err != nil {
		return nil, err
	}
	existing, _ := c.songRepo.GetByArtistIDAndSlug(ctx, artistID, slug)
	if existing != nil {
		return nil, errors.New("song with this slug already exists for this artist")
	}
	s := &entity.Song{
		ArtistID: artistID,
		Title:    title,
		Slug:     slug,
		Tonality: tonality,
		Content:  content,
	}
	if err := c.songRepo.Create(ctx, s); err != nil {
		return nil, err
	}
	return s, nil
}

func (c *SongCases) Update(ctx context.Context, id uint, title, slug *string, tonality *int, content *entity.TabContent) (*entity.Song, error) {
	s, err := c.songRepo.GetByID(ctx, id)
	if err != nil || s == nil {
		return nil, nil
	}
	if title != nil {
		s.Title = strings.TrimSpace(*title)
		if s.Title == "" {
			return nil, errors.New("title cannot be empty")
		}
	}
	if slug != nil {
		s.Slug = strings.TrimSpace(strings.ToLower(*slug))
		if s.Slug == "" {
			return nil, errors.New("slug cannot be empty")
		}
		if !slugRegex.MatchString(s.Slug) {
			return nil, errors.New("slug must be lowercase alphanumeric with hyphens or underscores")
		}
	}
	if tonality != nil {
		s.Tonality = *tonality
	}
	if content != nil {
		s.Content = *content
	}
	if err := c.songRepo.Update(ctx, s); err != nil {
		return nil, err
	}
	return s, nil
}

func (c *SongCases) Transpose(ctx context.Context, songID uint, semitones int) (*entity.Song, error) {
	s, err := c.songRepo.GetByID(ctx, songID)
	if err != nil || s == nil {
		return nil, nil
	}
	transposed := transposeContent(s.Content, semitones)
	s.Content = transposed
	s.Tonality += semitones
	return s, nil
}

func transposeContent(c entity.TabContent, semitones int) entity.TabContent {
	if semitones == 0 {
		return c
	}
	out := entity.TabContent{
		Sections: make([]entity.Section, len(c.Sections)),
		AsciiTab: c.AsciiTab,
	}
	for i, sec := range c.Sections {
		out.Sections[i] = entity.Section{
			Type:          sec.Type,
			Label:         sec.Label,
			ChordSequence: make([]string, len(sec.ChordSequence)),
			Blocks:        make([]entity.Block, len(sec.Blocks)),
		}
		for j, ch := range sec.ChordSequence {
			out.Sections[i].ChordSequence[j] = transposeChord(ch, semitones)
		}
		for j, bl := range sec.Blocks {
			out.Sections[i].Blocks[j] = entity.Block{
				Chord:  transposeChord(bl.Chord, semitones),
				Lyrics: bl.Lyrics,
			}
		}
	}
	return out
}

var chordNames = []string{"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}
var chordNamesFlat = []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}

func transposeChord(chord string, semitones int) string {
	if chord == "" || semitones == 0 {
		return chord
	}
	for i, name := range chordNames {
		if len(chord) >= len(name) && (chord[:len(name)] == name || (len(chord) > len(name) && chord[0] == name[0])) {
			root := chord[:len(name)]
			if root != name {
				for k, n := range chordNamesFlat {
					if chord[:len(n)] == n {
						root = n
						i = k
						break
					}
				}
			}
			suffix := chord[len(root):]
			newIdx := (i + semitones%12 + 12) % 12
			newRoot := chordNames[newIdx]
			return newRoot + suffix
		}
	}
	return chord
}
