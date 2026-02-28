package cases

import (
	"context"
	"errors"
	"strings"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
	"github.com/google/uuid"
)

var ErrDuplicateSong = errors.New("song with this slug already exists for this artist")

type SongCases struct {
	artistRepo repository.ArtistRepository
	songRepo   repository.SongRepository
}

func NewSongCases(artistRepo repository.ArtistRepository, songRepo repository.SongRepository) *SongCases {
	return &SongCases{artistRepo: artistRepo, songRepo: songRepo}
}

func (c *SongCases) ListByArtistID(ctx context.Context, artistID uuid.UUID) ([]*entity.Song, error) {
	return c.songRepo.ListByArtistID(ctx, artistID)
}

func (c *SongCases) Search(ctx context.Context, query string, limit, offset int) ([]*entity.Song, int64, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, 0, nil
	}
	return c.songRepo.Search(ctx, query, limit, offset)
}

func (c *SongCases) List(ctx context.Context, artistID *uuid.UUID, limit, offset int) ([]*entity.Song, int64, error) {
	return c.songRepo.List(ctx, artistID, limit, offset)
}

func (c *SongCases) GetByID(ctx context.Context, id uuid.UUID) (*entity.Song, error) {
	return c.songRepo.GetByID(ctx, id)
}

func (c *SongCases) Create(
	ctx context.Context,
	artistID uuid.UUID,
	title, slug string,
	tonality int,
	content entity.TabContent,
) (*entity.Song, error) {
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
	existing, errExisting := c.songRepo.GetByArtistIDAndSlug(ctx, artistID, slug)
	if errExisting != nil && !errors.Is(errExisting, repository.ErrNotFound) {
		return nil, errExisting
	}
	if existing != nil {
		return nil, ErrDuplicateSong
	}
	s := &entity.Song{
		SongID:   uuid.New(),
		ArtistID: artistID,
		Title:    title,
		Slug:     slug,
		Tonality: tonality,
		Content:  content,
	}
	if createErr := c.songRepo.Create(ctx, s); createErr != nil {
		return nil, createErr
	}
	return s, nil
}

func (c *SongCases) Update(
	ctx context.Context,
	id uuid.UUID,
	title, slug *string,
	tonality *int,
	content *entity.TabContent,
) (*entity.Song, error) {
	s, err := c.songRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if s == nil {
		return nil, repository.ErrNotFound
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
	if updateErr := c.songRepo.Update(ctx, s); updateErr != nil {
		return nil, updateErr
	}
	return s, nil
}

func (c *SongCases) Transpose(ctx context.Context, songID uuid.UUID, semitones int) (*entity.Song, error) {
	s, err := c.songRepo.GetByID(ctx, songID)
	if err != nil {
		return nil, err
	}
	if s == nil {
		return nil, repository.ErrNotFound
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
		Sections:  make([]entity.Section, len(c.Sections)),
		ChordTabs: transposeChordTabs(c.ChordTabs, semitones),
	}
	for i, sec := range c.Sections {
		out.Sections[i] = entity.Section{
			Type:          sec.Type,
			Label:         sec.Label,
			ChordSequence: make([]string, len(sec.ChordSequence)),
			Blocks:        make([]entity.Block, len(sec.Blocks)),
		}
		for j, ch := range sec.ChordSequence {
			out.Sections[i].ChordSequence[j] = entity.TransposeChord(ch, semitones)
		}
		for j, bl := range sec.Blocks {
			out.Sections[i].Blocks[j] = transposeBlock(bl, semitones)
		}
	}
	return out
}

func transposeChordTabs(chordTabs map[string]string, semitones int) map[string]string {
	if chordTabs == nil || semitones == 0 {
		return chordTabs
	}
	out := make(map[string]string, len(chordTabs))
	for chord, tab := range chordTabs {
		out[entity.TransposeChord(chord, semitones)] = tab
	}
	return out
}

func transposeBlock(bl entity.Block, semitones int) entity.Block {
	out := entity.Block{Kind: bl.Kind, Label: bl.Label, Tab: bl.Tab}
	switch bl.Kind {
	case "instrumental":
		if len(bl.Chords) > 0 {
			out.Chords = make([]string, len(bl.Chords))
			for k, ch := range bl.Chords {
				out.Chords[k] = entity.TransposeChord(ch, semitones)
			}
		}
	case "lyrics":
		if len(bl.Segments) > 0 {
			out.Segments = make([]entity.ChordSegment, len(bl.Segments))
			for k, seg := range bl.Segments {
				out.Segments[k] = entity.ChordSegment{
					Chord: entity.TransposeChord(seg.Chord, semitones),
					Text:  seg.Text,
				}
			}
		}
	}
	return out
}
