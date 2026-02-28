package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Helltale/amdm-guitar-chords/back/internal/cases"
	"github.com/Helltale/amdm-guitar-chords/back/internal/config"
	"github.com/Helltale/amdm-guitar-chords/back/internal/handler"
	"github.com/Helltale/amdm-guitar-chords/back/internal/handler/gen"
	"github.com/Helltale/amdm-guitar-chords/back/internal/migration"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
	"github.com/go-chi/chi/v5"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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
	if migrateErr := migration.Run(gormDB, migration.NewMigrations()); migrateErr != nil {
		log.Fatalf("migrate: %v", migrateErr)
	}
	sqlDB, err := gormDB.DB()
	if err != nil {
		log.Fatalf("db: %v", err)
	}

	artistRepo := repository.NewArtistRepository(gormDB)
	songRepo := repository.NewSongRepository(gormDB)
	artistCases := cases.NewArtistCases(artistRepo)
	songCases := cases.NewSongCases(artistRepo, songRepo)
	server := handler.NewServer(artistCases, songCases)

	rounter := chi.NewRouter()
	apiRouter := chi.NewRouter()
	gen.HandlerFromMux(gen.NewStrictHandler(server, nil), apiRouter)
	rounter.Mount("/api/amdm/v1", apiRouter)

	addr := ":" + cfg.Backend.Port
	httpSrv := &http.Server{
		Addr:         addr,
		Handler:      rounter,
		ReadTimeout:  cfg.Backend.ReadTimeout(),
		WriteTimeout: cfg.Backend.WriteTimeout(),
		IdleTimeout:  cfg.Backend.IdleTimeout(),
	}
	log.Printf("listening on %s", addr)

	serveDone := make(chan error, 1)
	go func() {
		serveDone <- httpSrv.ListenAndServe()
	}()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	var exitCode int
	select {
	case sig := <-sigCh:
		log.Printf("received %v, shutting down", sig)
	case err := <-serveDone:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Printf("serve: %v", err)
			exitCode = 1
		}
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if shutdownErr := httpSrv.Shutdown(shutdownCtx); shutdownErr != nil {
		log.Printf("shutdown: %v", shutdownErr)
		exitCode = 1
	}

	if closeErr := sqlDB.Close(); closeErr != nil {
		log.Printf("db close: %v", closeErr)
		exitCode = 1
	}
	os.Exit(exitCode)
}
