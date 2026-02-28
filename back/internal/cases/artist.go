package cases

import (
	"context"
	"errors"
	"regexp"
	"strings"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
	"github.com/google/uuid"
)

var slugRegex = regexp.MustCompile(`^[a-z0-9]+(?:[-_][a-z0-9]+)*$`)

var ErrDuplicateArtist = errors.New("artist with this slug already exists")

type ArtistCases struct {
	repo repository.ArtistRepository
}

func NewArtistCases(repo repository.ArtistRepository) *ArtistCases {
	return &ArtistCases{repo: repo}
}

func (c *ArtistCases) List(ctx context.Context, limit, offset int) ([]*entity.Artist, int64, error) {
	return c.repo.List(ctx, limit, offset)
}

func (c *ArtistCases) GetBySlug(ctx context.Context, slug string) (*entity.Artist, error) {
	return c.repo.GetBySlug(ctx, slug)
}

func (c *ArtistCases) Create(ctx context.Context, name, slug string) (*entity.Artist, error) {
	name = strings.TrimSpace(name)
	slug = strings.TrimSpace(strings.ToLower(slug))
	if name == "" {
		return nil, errors.New("name is required")
	}
	if slug == "" {
		return nil, errors.New("slug is required")
	}
	if !slugRegex.MatchString(slug) {
		return nil, errors.New("slug must be lowercase alphanumeric with hyphens or underscores")
	}
	existing, err := c.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrDuplicateArtist
	}
	a := &entity.Artist{ArtistID: uuid.New(), Name: name, Slug: slug}
	if createErr := c.repo.Create(ctx, a); createErr != nil {
		return nil, createErr
	}
	return a, nil
}
