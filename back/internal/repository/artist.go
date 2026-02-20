package repository

import (
	"context"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"gorm.io/gorm"
)

type ArtistRepository interface {
	GetByID(ctx context.Context, id uint) (*entity.Artist, error)
	GetBySlug(ctx context.Context, slug string) (*entity.Artist, error)
	List(ctx context.Context, limit, offset int) ([]*entity.Artist, int64, error)
	Create(ctx context.Context, a *entity.Artist) error
	Update(ctx context.Context, a *entity.Artist) error
}

type artistRepo struct {
	db *gorm.DB
}

func NewArtistRepository(db *gorm.DB) ArtistRepository {
	return &artistRepo{db: db}
}

func (r *artistRepo) GetByID(ctx context.Context, id uint) (*entity.Artist, error) {
	var a entity.Artist
	err := r.db.WithContext(ctx).First(&a, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *artistRepo) GetBySlug(ctx context.Context, slug string) (*entity.Artist, error) {
	var a entity.Artist
	err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&a).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *artistRepo) List(ctx context.Context, limit, offset int) ([]*entity.Artist, int64, error) {
	var total int64
	if err := r.db.WithContext(ctx).Model(&entity.Artist{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var list []*entity.Artist
	err := r.db.WithContext(ctx).Limit(limit).Offset(offset).Order("name").Find(&list).Error
	return list, total, err
}

func (r *artistRepo) Create(ctx context.Context, a *entity.Artist) error {
	return r.db.WithContext(ctx).Create(a).Error
}

func (r *artistRepo) Update(ctx context.Context, a *entity.Artist) error {
	return r.db.WithContext(ctx).Save(a).Error
}
