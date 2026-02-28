package entity

const semitonesPerOct = 12

func ChordNamesSharp() []string {
	return []string{"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}
}
func ChordNamesFlat() []string {
	return []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}
}

func TransposeChord(chord string, semitones int) string {
	if chord == "" || semitones == 0 {
		return chord
	}
	root, idx := findRoot(chord)
	if root == "" {
		return chord
	}
	suffix := chord[len(root):]
	newIdx := (idx + semitones%semitonesPerOct + semitonesPerOct) % semitonesPerOct
	return ChordNamesSharp()[newIdx] + suffix
}

func findRoot(chord string) (string, int) {
	sharp := ChordNamesSharp()
	flat := ChordNamesFlat()
	for i, name := range sharp {
		if len(chord) < len(name) {
			continue
		}
		root := chord[:len(name)]
		matches := root == name || (len(chord) > len(name) && chord[0] == name[0])
		if !matches {
			continue
		}
		if root != name {
			for k, n := range flat {
				if len(chord) >= len(n) && chord[:len(n)] == n {
					return n, k
				}
			}
		}
		return root, i
	}
	return "", -1
}
