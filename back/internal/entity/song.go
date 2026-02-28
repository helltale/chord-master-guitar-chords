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

type ChordSegment struct {
	Chord string `json:"chord"`
	Text  string `json:"text"`
}

type Block struct {
	Kind     string         `json:"kind"`
	Label    string         `json:"label,omitempty"`
	Chords   []string       `json:"chords,omitempty"`
	Tab      string         `json:"tab,omitempty"`
	Segments []ChordSegment `json:"segments,omitempty"`
}

func (b *Block) UnmarshalJSON(data []byte) error {
	var raw map[string]json.RawMessage
	if err := json.Unmarshal(data, &raw); err != nil {
		return err
	}
	if _, hasKind := raw["kind"]; hasKind {
		type block Block
		var decoded block
		if err := json.Unmarshal(data, &decoded); err != nil {
			return err
		}
		*b = Block(decoded)
		return nil
	}
	var chord, lyrics string
	if c, ok := raw["chord"]; ok {
		_ = json.Unmarshal(c, &chord)
	}
	if l, ok := raw["lyrics"]; ok {
		_ = json.Unmarshal(l, &lyrics)
	}
	b.Kind = "lyrics"
	b.Segments = []ChordSegment{{Chord: chord, Text: lyrics}}
	return nil
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
