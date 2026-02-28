package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Artist struct {
	ArtistID  uuid.UUID      `gorm:"type:uuid;primaryKey;column:artist_id" json:"artist_id"`
	Name      string         `gorm:"size:255;not null"                     json:"name"`
	Slug      string         `gorm:"size:255;uniqueIndex;not null"         json:"slug"`
	CreatedAt time.Time      `                                             json:"created_at"`
	UpdatedAt time.Time      `                                             json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index"                                 json:"-"`
}
