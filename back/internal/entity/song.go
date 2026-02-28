package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TabContent struct {
	Sections []Section `json:"sections"`
	ASCIITab string    `json:"ascii_tab,omitempty"`
}

type Section struct {
	Type          string   `json:"type"`
	Label         string   `json:"label"`
	ChordSequence []string `json:"chord_sequence"`
	Blocks        []Block  `json:"blocks"`
}

type Block struct {
	Chord  string `json:"chord"`
	Lyrics string `json:"lyrics"`
}

func (c *TabContent) Value() (driver.Value, error) {
	return json.Marshal(c)
}

func (c *TabContent) Scan(value any) error {
	if value == nil {
		*c = TabContent{}
		return nil
	}
	b, ok := value.([]byte)
	if !ok {
		return errors.New("invalid type for TabContent")
	}
	return json.Unmarshal(b, c)
}

type Song struct {
	SongID    uuid.UUID      `gorm:"type:uuid;primaryKey;column:song_id"                 json:"song_id"`
	ArtistID  uuid.UUID      `gorm:"type:uuid;not null;index;column:artist_id"           json:"artist_id"`
	Artist    *Artist        `gorm:"foreignKey:ArtistID"                                 json:"artist,omitempty"`
	Title     string         `gorm:"size:255;not null"                                   json:"title"`
	Slug      string         `gorm:"size:255;not null;index:idx_song_artist_slug,unique" json:"slug"`
	Tonality  int            `gorm:"default:0"                                           json:"tonality"`
	Content   TabContent     `gorm:"type:jsonb;default:'{}'"                             json:"content"`
	CreatedAt time.Time      `                                                           json:"created_at"`
	UpdatedAt time.Time      `                                                           json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index"                                               json:"-"`
}
