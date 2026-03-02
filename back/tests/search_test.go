//go:build integration

package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"
)

func TestSearch_EmptyQuery_ReturnsEmpty(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase

	// Пустой/пробельный q: cases возвращают пустой список без вызова поиска. Используем пробел,
	// т.к. строго пустой q может отвергаться роутером (required param).
	resp, err := server.Client().Get(base + "/search?q=%20")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("GET /search?q= : status = %d, want 200", resp.StatusCode)
	}
	var result struct {
		Artists      []any `json:"artists"`
		TotalArtists int   `json:"total_artists"`
		Songs        []any `json:"songs"`
		TotalSongs   int   `json:"total_songs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}
	if len(result.Artists) != 0 {
		t.Errorf("artists length = %d, want 0", len(result.Artists))
	}
	if result.TotalArtists != 0 {
		t.Errorf("total_artists = %d, want 0", result.TotalArtists)
	}
	if len(result.Songs) != 0 {
		t.Errorf("songs length = %d, want 0", len(result.Songs))
	}
	if result.TotalSongs != 0 {
		t.Errorf("total_songs = %d, want 0", result.TotalSongs)
	}
}

func TestSearch_BySongTitle(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	artistID := createArtistAndGetID(t, base, client, "Search Artist", "search-artist")
	uniqueTitle := "UniqueTitleForSearch123"
	body := `{"artist_id":"` + artistID + `","title":"` + uniqueTitle + `","slug":"unique-slug"}`
	cr, _ := client.Post(base+"/songs", "application/json", strings.NewReader(body))
	cr.Body.Close()

	resp, err := client.Get(base + "/search?q=" + "UniqueTitleForSearch")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("search: %d", resp.StatusCode)
	}
	var result struct {
		Songs      []struct{ Title string `json:"title"` } `json:"songs"`
		TotalSongs int `json:"total_songs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}
	if result.TotalSongs < 1 {
		t.Errorf("total_songs = %d, want at least 1", result.TotalSongs)
	}
	found := false
	for _, it := range result.Songs {
		if strings.Contains(it.Title, "UniqueTitleForSearch") {
			found = true
			break
		}
	}
	if !found {
		t.Errorf("search by title: expected song %q in songs %+v", uniqueTitle, result.Songs)
	}
}

func TestSearch_ByArtistName(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	artistID := createArtistAndGetID(t, base, client, "BandForSearch", "band-for-search")
	body := `{"artist_id":"` + artistID + `","title":"Any Song","slug":"any-song"}`
	r, _ := client.Post(base+"/songs", "application/json", strings.NewReader(body))
	r.Body.Close()

	resp, err := client.Get(base + "/search?q=BandForSearch")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("search: %d", resp.StatusCode)
	}
	var result struct {
		Artists      []struct{ Name string `json:"name"` } `json:"artists"`
		Songs        []struct{ Title string `json:"title"` } `json:"songs"`
		TotalArtists int `json:"total_artists"`
		TotalSongs   int `json:"total_songs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}
	if result.TotalArtists < 1 {
		t.Errorf("total_artists = %d, want at least 1", result.TotalArtists)
	}
	if result.TotalSongs < 1 {
		t.Errorf("total_songs = %d, want at least 1", result.TotalSongs)
	}
	artistFound := false
	for _, a := range result.Artists {
		if a.Name == "BandForSearch" {
			artistFound = true
			break
		}
	}
	if !artistFound {
		t.Errorf("search by artist name: expected artist 'BandForSearch' in artists %+v", result.Artists)
	}
	songFound := false
	for _, it := range result.Songs {
		if it.Title == "Any Song" {
			songFound = true
			break
		}
	}
	if !songFound {
		t.Errorf("search by artist name: expected 'Any Song' in songs %+v", result.Songs)
	}
}

func TestSearch_Pagination(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	artistID := createArtistAndGetID(t, base, client, "Page Artist", "page-artist")
	for i := 0; i < 5; i++ {
		slug := "page-song-" + string(rune('a'+i))
		title := "PageSong" + string(rune('A'+i))
		body := `{"artist_id":"` + artistID + `","title":"` + title + `","slug":"` + slug + `"}`
		r, _ := client.Post(base+"/songs", "application/json", strings.NewReader(body))
		r.Body.Close()
	}

	resp, err := client.Get(base + "/search?q=PageSong&limit=2&offset=1")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("search: %d", resp.StatusCode)
	}
	var result struct {
		Songs      []struct{ Title string `json:"title"` } `json:"songs"`
		TotalSongs int `json:"total_songs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatal(err)
	}
	if result.TotalSongs < 5 {
		t.Errorf("total_songs = %d, want at least 5", result.TotalSongs)
	}
	if len(result.Songs) != 2 {
		t.Errorf("songs length = %d, want 2 (limit=2)", len(result.Songs))
	}
}
