package entity

import (
	"time"

	"github.com/google/uuid"
)

// SongOpen is one recorded view of a song detail page (for popularity stats).
type SongOpen struct {
	ID       int64     `gorm:"primaryKey;autoIncrement"`
	SongID   uuid.UUID `gorm:"type:uuid;not null;index;column:song_id"`
	OpenedAt time.Time `gorm:"not null;index;column:opened_at"`
}
