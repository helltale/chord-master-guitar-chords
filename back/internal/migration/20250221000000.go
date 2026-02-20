package migration

import (
	"github.com/pkg/errors"
	"gorm.io/gorm"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
)

func Migration20250220000001(db *gorm.DB) error {
	if err := db.AutoMigrate(&entity.Artist{}, &entity.Song{}); err != nil {
		return errors.Wrap(err, "auto migrate artists and songs")
	}
	return nil
}
