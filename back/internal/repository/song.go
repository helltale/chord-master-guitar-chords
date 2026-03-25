package repository

import (
	"context"
	"errors"
	"strings"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SongRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*entity.Song, error)
	GetByArtistIDAndSlug(ctx context.Context, artistID uuid.UUID, slug string) (*entity.Song, error)
	List(
		ctx context.Context,
		artistID *uuid.UUID,
		limit, offset int,
		sort string,
	) ([]*entity.Song, int64, error)
	ListByArtistID(ctx context.Context, artistID uuid.UUID) ([]*entity.Song, error)
	Search(ctx context.Context, query string, limit, offset int) ([]*entity.Song, int64, error)
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

func (r *songRepo) List(
	ctx context.Context,
	artistID *uuid.UUID,
	limit, offset int,
	sort string,
) ([]*entity.Song, int64, error) {
	q := r.db.WithContext(ctx).Model(&entity.Song{})
	if artistID != nil {
		q = q.Where("artist_id = ?", *artistID)
	}
	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	order := "title"
	if sort == "created_at_desc" {
		order = "created_at DESC"
	}
	var list []*entity.Song
	q = r.db.WithContext(ctx).Preload("Artist").Limit(limit).Offset(offset).Order(order)
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

// EscapeLikePattern escapes \ % _ for safe use in PostgreSQL ILIKE (escape char is backslash).
func EscapeLikePattern(s string) string {
	s = strings.ReplaceAll(s, `\`, `\\`)
	s = strings.ReplaceAll(s, "%", `\%`)
	s = strings.ReplaceAll(s, "_", `\_`)
	return s
}

func (r *songRepo) Search(ctx context.Context, query string, limit, offset int) ([]*entity.Song, int64, error) {
	pattern := "%" + EscapeLikePattern(query) + "%"
	var total int64
	err := r.db.WithContext(ctx).Raw(
		`SELECT COUNT(DISTINCT songs.song_id) FROM songs
		 JOIN artists ON artists.artist_id = songs.artist_id
		 WHERE artists.name ILIKE ? OR artists.slug ILIKE ? OR songs.title ILIKE ?`,
		pattern, pattern, pattern,
	).Scan(&total).Error
	if err != nil {
		return nil, 0, err
	}
	var idRows []struct {
		SongID uuid.UUID `gorm:"column:song_id"`
	}
	err = r.db.WithContext(ctx).Raw(
		`SELECT song_id FROM (
		   SELECT DISTINCT ON (songs.song_id) songs.song_id, artists.name AS artist_name, songs.title AS song_title
		   FROM songs JOIN artists ON artists.artist_id = songs.artist_id
		   WHERE artists.name ILIKE ? OR artists.slug ILIKE ? OR songs.title ILIKE ?
		   ORDER BY songs.song_id, artists.name, songs.title
		 ) sub
		 ORDER BY sub.artist_name, sub.song_title
		 LIMIT ? OFFSET ?`,
		pattern, pattern, pattern, limit, offset,
	).Scan(&idRows).Error
	if err != nil {
		return nil, 0, err
	}
	if len(idRows) == 0 {
		return nil, total, nil
	}
	ids := make([]uuid.UUID, 0, len(idRows))
	for _, row := range idRows {
		ids = append(ids, row.SongID)
	}
	var list []*entity.Song
	err = r.db.WithContext(ctx).Where("song_id IN ?", ids).Find(&list).Error
	if err != nil {
		return nil, 0, err
	}
	byID := make(map[uuid.UUID]*entity.Song, len(list))
	for _, s := range list {
		byID[s.SongID] = s
	}
	ordered := make([]*entity.Song, 0, len(ids))
	for _, id := range ids {
		if s, ok := byID[id]; ok {
			ordered = append(ordered, s)
		}
	}
	return ordered, total, nil
}

func (r *songRepo) Create(ctx context.Context, s *entity.Song) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *songRepo) Update(ctx context.Context, s *entity.Song) error {
	return r.db.WithContext(ctx).Save(s).Error
}
