package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/Helltale/amdm-guitar-chords/back/internal/cases"
	"github.com/Helltale/amdm-guitar-chords/back/internal/config"
	"github.com/Helltale/amdm-guitar-chords/back/internal/handler"
	"github.com/Helltale/amdm-guitar-chords/back/internal/migration"
	"github.com/Helltale/amdm-guitar-chords/back/internal/handler/gen"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	gormDB, err := gorm.Open(postgres.Open(cfg.Database.DSN()), &gorm.Config{})
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	defer func() {
		sqlDB, err := gormDB.DB()
		if err != nil {
			log.Printf("db close: %v", err)
			return
		}
		if err := sqlDB.Close(); err != nil {
			log.Printf("db close: %v", err)
		}
	}()

	if err := migration.Run(gormDB, migration.NewMigrations()); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	artistRepo := repository.NewArtistRepository(gormDB)
	songRepo := repository.NewSongRepository(gormDB)
	artistCases := cases.NewArtistCases(artistRepo)
	songCases := cases.NewSongCases(artistRepo, songRepo)
	srv := handler.NewServer(artistCases, songCases)

	r := chi.NewRouter()
	apiRouter := chi.NewRouter()
	gen.HandlerFromMux(gen.NewStrictHandler(srv, nil), apiRouter)
	r.Mount("/api/amdm/v1", apiRouter)

	addr := ":" + cfg.Backend.Port
	log.Printf("listening on %s", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("serve: %v", err)
	}
}
