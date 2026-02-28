package config

import (
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/ilyakaznacheev/cleanenv"
)

//nolint:golines // long struct tags with metadata
type DatabaseConfig struct {
	Host         string `env:"DB_HOST" env-default:"localhost" validate:"required"`
	Port         string `env:"DB_PORT" env-default:"5432" validate:"required"`
	User         string `env:"DB_USER" env-default:"amdm" validate:"required"`
	Password     string `env:"DB_PASSWORD" env-default:"amdm" validate:"required"`
	DBName       string `env:"DB_NAME" env-default:"amdm" validate:"required"`
	SSLMode      string `env:"DB_SSLMODE" env-default:"disable" validate:"oneof=disable require verify-full verify-ca"`
	MaxIdleConns int    `env:"DB_MAX_IDLE_CONNS" env-default:"10" validate:"min=1,max=1000"`
	MaxOpenConns int    `env:"DB_MAX_OPEN_CONNS" env-default:"100" validate:"min=1,max=10000"`
}

//nolint:golines // long struct tags with metadata
type BackendConfig struct {
	Port            string `env:"SERVER_PORT" env-default:"8081" validate:"required"`
	LogLevel        string `env:"BACKEND_LOG_LEVEL" env-default:"info" validate:"oneof=debug info warn error"`
	Env             string `env:"BACKEND_ENV" env-default:"development" validate:"oneof=development production staging"`
	ReadTimeoutSec  int    `env:"SERVER_READ_TIMEOUT_SEC" env-default:"15" validate:"min=1,max=300"`
	WriteTimeoutSec int    `env:"SERVER_WRITE_TIMEOUT_SEC" env-default:"15" validate:"min=1,max=300"`
	IdleTimeoutSec  int    `env:"SERVER_IDLE_TIMEOUT_SEC" env-default:"60" validate:"min=1,max=600"`
}

type Config struct {
	Database DatabaseConfig
	Backend  BackendConfig
}

func Load() (*Config, error) {
	cfg := &Config{}

	if err := cleanenv.ReadEnv(&cfg.Database); err != nil {
		return nil, fmt.Errorf("failed to load database configuration: %w", err)
	}

	if err := cleanenv.ReadEnv(&cfg.Backend); err != nil {
		return nil, fmt.Errorf("failed to load backend configuration: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return cfg, nil
}

func (c *Config) Validate() error {
	validate := validator.New()

	if err := validate.Struct(c.Database); err != nil {
		return fmt.Errorf("database config validation failed: %w", err)
	}

	if err := validate.Struct(c.Backend); err != nil {
		return fmt.Errorf("backend config validation failed: %w", err)
	}

	return nil
}

func (c *DatabaseConfig) DSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}

func (c *BackendConfig) ReadTimeout() time.Duration {
	return time.Duration(c.ReadTimeoutSec) * time.Second
}

func (c *BackendConfig) WriteTimeout() time.Duration {
	return time.Duration(c.WriteTimeoutSec) * time.Second
}

func (c *BackendConfig) IdleTimeout() time.Duration {
	return time.Duration(c.IdleTimeoutSec) * time.Second
}
