package entity //nolint:testpackage // тесты методов типов и экспортируемых функций

import (
	"encoding/json"
	"testing"
)

func TestBlock_UnmarshalJSON(t *testing.T) {
	tests := []struct {
		name    string
		json    string
		want    Block
		wantErr bool
	}{
		{
			name: "full block with kind",
			json: `{"kind":"instrumental","label":"Intro","chords":["C","G"],"tab":"","segments":null}`,
			want: Block{Kind: "instrumental", Label: "Intro", Chords: []string{"C", "G"}},
		},
		{
			name: "lyrics block with segments",
			json: `{"kind":"lyrics","label":"","chords":null,"tab":"","segments":[{"chord":"Am","text":"Hello"}]}`,
			want: Block{Kind: "lyrics", Segments: []ChordSegment{{Chord: "Am", Text: "Hello"}}},
		},
		{
			name: "legacy chord+lyrics format",
			json: `{"chord":"C","lyrics":"some text"}`,
			want: Block{Kind: "lyrics", Segments: []ChordSegment{{Chord: "C", Text: "some text"}}},
		},
		{
			name: "legacy empty chord",
			json: `{"chord":"","lyrics":"only text"}`,
			want: Block{Kind: "lyrics", Segments: []ChordSegment{{Chord: "", Text: "only text"}}},
		},
		{
			name:    "invalid json",
			json:    `{`,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var b Block
			err := b.UnmarshalJSON([]byte(tt.json))
			if (err != nil) != tt.wantErr {
				t.Errorf("UnmarshalJSON() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.wantErr {
				return
			}
			assertBlockEqual(t, b, tt.want)
		})
	}
}

func assertBlockEqual(t *testing.T, b, want Block) {
	t.Helper()
	if b.Kind != want.Kind {
		t.Errorf("Kind = %q, want %q", b.Kind, want.Kind)
	}
	if b.Label != want.Label {
		t.Errorf("Label = %q, want %q", b.Label, want.Label)
	}
	if len(b.Chords) != len(want.Chords) {
		t.Errorf("Chords length = %d, want %d", len(b.Chords), len(want.Chords))
	} else {
		for i := range want.Chords {
			if b.Chords[i] != want.Chords[i] {
				t.Errorf("Chords[%d] = %q, want %q", i, b.Chords[i], want.Chords[i])
			}
		}
	}
	if len(b.Segments) != len(want.Segments) {
		t.Errorf("Segments length = %d, want %d", len(b.Segments), len(want.Segments))
	} else {
		for i := range want.Segments {
			if b.Segments[i].Chord != want.Segments[i].Chord || b.Segments[i].Text != want.Segments[i].Text {
				t.Errorf("Segments[%d] = %+v, want %+v", i, b.Segments[i], want.Segments[i])
			}
		}
	}
}

func TestTabContent_Value(t *testing.T) {
	tests := []struct {
		name string
		c    TabContent
	}{
		{"empty", TabContent{}},
		{
			"with sections",
			TabContent{
				Sections: []Section{{
					Type: "verse", Label: "1",
					ChordSequence: []string{"C"},
					Blocks:        nil,
				}},
			},
		},
		{"with chord_tabs", TabContent{ChordTabs: map[string]string{"C": "x32010"}}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			v, err := tt.c.Value()
			if err != nil {
				t.Errorf("Value() error = %v", err)
				return
			}
			if v == nil {
				t.Error("Value() returned nil")
			}
			b, ok := v.([]byte)
			if !ok {
				t.Errorf("Value() type = %T, want []byte", v)
				return
			}
			var decoded TabContent
			if decodeErr := json.Unmarshal(b, &decoded); decodeErr != nil {
				t.Errorf("Value() produced invalid JSON: %v", decodeErr)
			}
		})
	}
}

func TestTabContent_Scan(t *testing.T) {
	validJSON := []byte(
		`{"sections":[{"type":"verse","label":"1","chord_sequence":["C"],"blocks":[]}],"chord_tabs":{}}`,
	)
	tests := []struct {
		name    string
		value   any
		wantErr bool
	}{
		{"nil", nil, false},
		{"valid bytes", validJSON, false},
		{"invalid type string", "not bytes", true},
		{"invalid type int", 42, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var c TabContent
			err := c.Scan(tt.value)
			if (err != nil) != tt.wantErr {
				t.Errorf("Scan() error = %v, wantErr %v", err, tt.wantErr)
			}
			if tt.name == "nil" && (len(c.Sections) != 0 || c.ChordTabs != nil) {
				t.Error("Scan(nil) should zero TabContent")
			}
		})
	}
}
