package entity

const semitonesPerOct = 12

func ChordNamesSharp() []string {
	return []string{"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"}
}
func ChordNamesFlat() []string {
	return []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}
}

// ChordTabShape описывает форму аппликатуры в виде 6 символов:
// с низкой к высокой струне (E A D G B e). Каждый символ:
// - 'x' — струна не играет,
// - '0' — открытая струна,
// - '1'..'9' — лад.
//
// Примеры:
// - E  мажор:  "022100"
// - A  мажор:  "x02220"
// - H  мажор:  "x24442"
// - G#m баррэ: "466444".
type ChordTabShape string

// DefaultChordTabs содержит предопределённые аппликатуры для типичных аккордов.
// Это по сути константная таблица, поэтому допустимо хранить её в глобальной
// переменной для быстрого доступа и переиспользования.
//
//nolint:gochecknoglobals // таблица-константа с дефолтными аппликатурами
var DefaultChordTabs = map[string]ChordTabShape{
	// Открытые аккорды
	"C":  "x32010",
	"D":  "xx0232",
	"E":  "022100",
	"F":  "133211",
	"G":  "320003",
	"A":  "x02220",
	"Am": "x02210",
	"Em": "022000",
	"Dm": "xx0231",

	// Баррэ и более сложные варианты (пример из скриншота)
	"G#m": "466444",
	"C#m": "x46654",
	"H":   "x24442",
	"Bm":  "x24432",
}

func LookupChordTab(name string) (ChordTabShape, bool) {
	shape, ok := DefaultChordTabs[name]
	return shape, ok
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
