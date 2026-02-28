package repository_test

import (
	"testing"

	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
)

func TestEscapeLikePattern(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{"empty", "", ""},
		{"plain", "Звери", "Звери"},
		{"percent", "100%", `100\%`},
		{"underscore", "a_b", `a\_b`},
		{"backslash", `a\b`, `a\\b`},
		{"all special", `%\_\`, `\%\\\_\\`},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := repository.EscapeLikePattern(tt.input); got != tt.want {
				t.Errorf("EscapeLikePattern(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}
