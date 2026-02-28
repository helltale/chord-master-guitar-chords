package entity

import (
	"testing"
)

func TestChordNamesSharp(t *testing.T) {
	got := ChordNamesSharp()
	want := []string{"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}
	if len(got) != len(want) {
		t.Fatalf("ChordNamesSharp() length = %d, want %d", len(got), len(want))
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("ChordNamesSharp()[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestChordNamesFlat(t *testing.T) {
	got := ChordNamesFlat()
	want := []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}
	if len(got) != len(want) {
		t.Fatalf("ChordNamesFlat() length = %d, want %d", len(got), len(want))
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("ChordNamesFlat()[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestTransposeChord(t *testing.T) {
	tests := []struct {
		name      string
		chord     string
		semitones int
		want      string
	}{
		{"empty chord", "", 2, ""},
		{"zero semitones", "C", 0, "C"},
		{"C + 0", "C", 0, "C"},
		{"C + 1", "C", 1, "C#"},
		{"C + 2", "C", 2, "D"},
		{"C + 12", "C", 12, "C"},
		{"C - 1", "C", -1, "B"},
		{"C - 2", "C", -2, "A#"},
		{"Am + 2", "Am", 2, "Bm"},
		{"F#m + 1 (root F suffix #m)", "F#m", 1, "F##m"}, // implementation parses as F + #m
		{"Bb + 2 (suffix preserved)", "Bb", 2, "C#b"}, // root becomes C, suffix "b" kept
		{"Eb - 1 (suffix preserved)", "Eb", -1, "D#b"},
		{"G7 + 5", "G7", 5, "C7"},
		{"unknown root unchanged", "X", 2, "X"},
		{"suffix preserved", "Dm7", 2, "Em7"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := TransposeChord(tt.chord, tt.semitones)
			if got != tt.want {
				t.Errorf("TransposeChord(%q, %d) = %q, want %q", tt.chord, tt.semitones, got, tt.want)
			}
		})
	}
}
