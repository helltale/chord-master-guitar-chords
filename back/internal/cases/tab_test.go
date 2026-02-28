package cases //nolint:testpackage // тесты только экспортируемого API (UsedChords, UsedChordTabs)

import (
	"testing"

	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
)

func TestUsedChords(t *testing.T) {
	tests := []struct {
		name    string
		content entity.TabContent
		want    []string
	}{
		{
			name:    "empty",
			content: entity.TabContent{},
			want:    nil,
		},
		{
			name: "chord_sequence only",
			content: entity.TabContent{
				Sections: []entity.Section{
					{ChordSequence: []string{"C", "G", "Am"}},
				},
			},
			want: []string{"C", "G", "Am"},
		},
		{
			name: "instrumental chords",
			content: entity.TabContent{
				Sections: []entity.Section{
					{
						Blocks: []entity.Block{
							{Kind: "instrumental", Chords: []string{"Em", "C"}},
						},
					},
				},
			},
			want: []string{"Em", "C"},
		},
		{
			name: "lyrics segments",
			content: entity.TabContent{
				Sections: []entity.Section{
					{
						Blocks: []entity.Block{
							{
								Kind: "lyrics",
								Segments: []entity.ChordSegment{
									{Chord: "F", Text: "hello"},
									{Chord: "G", Text: "world"},
								},
							},
						},
					},
				},
			},
			want: []string{"F", "G"},
		},
		{
			name: "deduplicate and skip empty",
			content: entity.TabContent{
				Sections: []entity.Section{
					{ChordSequence: []string{"C", "C", "", "G", "C"}},
				},
			},
			want: []string{"C", "G"},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := UsedChords(tt.content)
			if len(got) != len(tt.want) {
				t.Errorf("UsedChords() length = %d, want %d, got %v", len(got), len(tt.want), got)
				return
			}
			seen := make(map[string]int)
			for _, s := range got {
				seen[s]++
			}
			for _, s := range tt.want {
				if seen[s] != 1 {
					t.Errorf("UsedChords() want %q once, got count %d", s, seen[s])
				}
			}
		})
	}
}

func TestUsedChordTabs(t *testing.T) {
	tests := []struct {
		name    string
		content entity.TabContent
		want    map[string]string
	}{
		{
			name:    "empty",
			content: entity.TabContent{},
			want:    map[string]string{},
		},
		{
			name: "only used chords from sections",
			content: entity.TabContent{
				Sections: []entity.Section{
					{ChordSequence: []string{"C", "G"}},
				},
				ChordTabs: map[string]string{"C": "x32010", "G": "320003", "Am": "x02210"},
			},
			want: map[string]string{"C": "x32010", "G": "320003"},
		},
		{
			name: "skip empty tab",
			content: entity.TabContent{
				Sections: []entity.Section{
					{ChordSequence: []string{"C"}},
				},
				ChordTabs: map[string]string{"C": ""},
			},
			want: map[string]string{},
		},
		{
			name: "nil chord_tabs",
			content: entity.TabContent{
				Sections: []entity.Section{
					{ChordSequence: []string{"C"}},
				},
				ChordTabs: nil,
			},
			want: map[string]string{},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := UsedChordTabs(tt.content)
			if len(got) != len(tt.want) {
				t.Errorf("UsedChordTabs() length = %d, want %d", len(got), len(tt.want))
				return
			}
			for k, v := range tt.want {
				if g, ok := got[k]; !ok || g != v {
					t.Errorf("UsedChordTabs()[%q] = %q, want %q (ok=%v)", k, g, v, ok)
				}
			}
		})
	}
}
