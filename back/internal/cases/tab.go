package cases

import (
	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
)

func UsedChords(content entity.TabContent) []string {
	seen := make(map[string]struct{})
	var list []string
	add := func(chord string) {
		if chord == "" {
			return
		}
		if _, ok := seen[chord]; ok {
			return
		}
		seen[chord] = struct{}{}
		list = append(list, chord)
	}
	for _, sec := range content.Sections {
		for _, ch := range sec.ChordSequence {
			add(ch)
		}
		for _, bl := range sec.Blocks {
			switch bl.Kind {
			case "instrumental":
				for _, ch := range bl.Chords {
					add(ch)
				}
			case "lyrics":
				for _, seg := range bl.Segments {
					add(seg.Chord)
				}
			}
		}
	}
	return list
}

func UsedChordTabs(content entity.TabContent) map[string]string {
	used := make(map[string]struct{})
	for _, ch := range UsedChords(content) {
		used[ch] = struct{}{}
	}
	out := make(map[string]string)
	if content.ChordTabs == nil {
		return out
	}
	for ch, tab := range content.ChordTabs {
		if _, ok := used[ch]; ok && tab != "" {
			out[ch] = tab
		}
	}
	return out
}
