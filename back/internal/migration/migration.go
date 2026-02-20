package migration

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type DBMigration struct {
	ID      string
	Migrate func(*gorm.DB) error
}

type schemaMigration struct {
	ID         string    `gorm:"primaryKey;size:20"`
	ExecutedAt time.Time `gorm:"not null"`
}

func (schemaMigration) TableName() string {
	return "schema_migrations"
}

func Run(db *gorm.DB, migrations []*DBMigration) error {
	if err := db.AutoMigrate(&schemaMigration{}); err != nil {
		return fmt.Errorf("create schema_migrations table: %w", err)
	}

	for _, m := range migrations {
		var count int64
		if err := db.Model(&schemaMigration{}).Where("id = ?", m.ID).Count(&count).Error; err != nil {
			return fmt.Errorf("check migration %s: %w", m.ID, err)
		}
		if count > 0 {
			continue
		}
		if err := m.Migrate(db); err != nil {
			return fmt.Errorf("migration %s: %w", m.ID, err)
		}
		record := schemaMigration{ID: m.ID, ExecutedAt: time.Now().UTC()}
		if err := db.Create(&record).Error; err != nil {
			return fmt.Errorf("record migration %s: %w", m.ID, err)
		}
	}
	return nil
}
