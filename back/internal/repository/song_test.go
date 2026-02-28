package repository

import "testing"

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
			if got := escapeLikePattern(tt.input); got != tt.want {
				t.Errorf("escapeLikePattern(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}
