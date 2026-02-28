package repository

import (
	"context"
	"errors"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SongRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*entity.Song, error)
	GetByArtistIDAndSlug(ctx context.Context, artistID uuid.UUID, slug string) (*entity.Song, error)
	List(ctx context.Context, artistID *uuid.UUID, limit, offset int) ([]*entity.Song, int64, error)
	ListByArtistID(ctx context.Context, artistID uuid.UUID) ([]*entity.Song, error)
	Create(ctx context.Context, s *entity.Song) error
	Update(ctx context.Context, s *entity.Song) error
}

type songRepo struct {
	db *gorm.DB
}

func NewSongRepository(db *gorm.DB) SongRepository {
	return &songRepo{db: db}
}

func (r *songRepo) GetByID(ctx context.Context, id uuid.UUID) (*entity.Song, error) {
	var s entity.Song
	err := r.db.WithContext(ctx).Preload("Artist").First(&s, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &s, nil
}

func (r *songRepo) GetByArtistIDAndSlug(ctx context.Context, artistID uuid.UUID, slug string) (*entity.Song, error) {
	var s entity.Song
	err := r.db.WithContext(ctx).Where("artist_id = ? AND slug = ?", artistID, slug).First(&s).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &s, nil
}

func (r *songRepo) List(ctx context.Context, artistID *uuid.UUID, limit, offset int) ([]*entity.Song, int64, error) {
	q := r.db.WithContext(ctx).Model(&entity.Song{})
	if artistID != nil {
		q = q.Where("artist_id = ?", *artistID)
	}
	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var list []*entity.Song
	q = r.db.WithContext(ctx).Preload("Artist").Limit(limit).Offset(offset).Order("title")
	if artistID != nil {
		q = q.Where("artist_id = ?", *artistID)
	}
	err := q.Find(&list).Error
	return list, total, err
}

func (r *songRepo) ListByArtistID(ctx context.Context, artistID uuid.UUID) ([]*entity.Song, error) {
	var list []*entity.Song
	err := r.db.WithContext(ctx).Where("artist_id = ?", artistID).Order("title").Find(&list).Error
	return list, err
}

func (r *songRepo) Create(ctx context.Context, s *entity.Song) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *songRepo) Update(ctx context.Context, s *entity.Song) error {
	return r.db.WithContext(ctx).Save(s).Error
}
