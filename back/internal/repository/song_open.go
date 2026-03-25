package repository

import (
	"context"
	"time"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SongOpenRepository records song page views for trending stats.
type SongOpenRepository interface {
	Record(ctx context.Context, songID uuid.UUID) error
}

type songOpenRepo struct {
	db *gorm.DB
}

func NewSongOpenRepository(db *gorm.DB) SongOpenRepository {
	return &songOpenRepo{db: db}
}

func (r *songOpenRepo) Record(ctx context.Context, songID uuid.UUID) error {
	row := entity.SongOpen{
		SongID:   songID,
		OpenedAt: time.Now().UTC(),
	}
	return r.db.WithContext(ctx).Create(&row).Error
}
