package migration

func NewMigrations() []*DBMigration {
	return []*DBMigration{
		{
			ID:      "20250220000001",
			Migrate: Migration20250220000001,
		},
	}
}
