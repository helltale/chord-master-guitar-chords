package cases

import (
	"context"
	"errors"
	"regexp"
	"strings"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
)

var slugRegex = regexp.MustCompile(`^[a-z0-9]+(?:[-_][a-z0-9]+)*$`)

type ArtistCases struct {
	repo repository.ArtistRepository
}

func NewArtistCases(repo repository.ArtistRepository) *ArtistCases {
	return &ArtistCases{repo: repo}
}

func (c *ArtistCases) List(ctx context.Context, limit, offset int) ([]*entity.Artist, int64, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
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
		return nil, errors.New("artist with this slug already exists")
	}
	a := &entity.Artist{Name: name, Slug: slug}
	if err := c.repo.Create(ctx, a); err != nil {
		return nil, err
	}
	return a, nil
}
