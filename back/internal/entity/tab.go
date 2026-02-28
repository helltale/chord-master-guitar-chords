package entity

const semitonesPerOct = 12

var ChordNamesSharp = []string{"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}
var ChordNamesFlat = []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}

func TransposeChord(chord string, semitones int) string {
	if chord == "" || semitones == 0 {
		return chord
	}
	for i, name := range ChordNamesSharp {
		if len(chord) >= len(name) && (chord[:len(name)] == name || (len(chord) > len(name) && chord[0] == name[0])) {
			root := chord[:len(name)]
			if root != name {
				for k, n := range ChordNamesFlat {
					if len(chord) >= len(n) && chord[:len(n)] == n {
						root = n
						i = k
						break
					}
				}
			}
			suffix := chord[len(root):]
			newIdx := (i + semitones%semitonesPerOct + semitonesPerOct) % semitonesPerOct
			newRoot := ChordNamesSharp[newIdx]
			return newRoot + suffix
		}
	}
	return chord
}
