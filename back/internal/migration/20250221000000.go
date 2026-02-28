package migration

import (
	"github.com/pkg/errors"
	"gorm.io/gorm"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
)

func Migration20250221000000(db *gorm.DB) error {
	if err := db.AutoMigrate(&entity.Artist{}); err != nil {
		return errors.Wrap(err, "auto migrate artists")
	}
	if err := db.AutoMigrate(&entity.Song{}); err != nil {
		return errors.Wrap(err, "auto migrate songs")
	}
	return nil
}
