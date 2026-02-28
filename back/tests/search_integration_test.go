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
	var list struct {
		Items *[]any `json:"items"`
		Total *int   `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if list.Items == nil {
		list.Items = &[]any{}
	}
	if len(*list.Items) != 0 {
		t.Errorf("items length = %d, want 0", len(*list.Items))
	}
	if list.Total == nil || *list.Total != 0 {
		t.Errorf("total = %v, want 0", list.Total)
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
	var list struct {
		Items *[]struct {
			Title string `json:"title"`
		} `json:"items"`
		Total *int `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if list.Total == nil || *list.Total < 1 {
		t.Errorf("total = %v, want at least 1", list.Total)
	}
	found := false
	if list.Items != nil {
		for _, it := range *list.Items {
			if strings.Contains(it.Title, "UniqueTitleForSearch") {
				found = true
				break
			}
		}
	}
	if !found {
		t.Errorf("search by title: expected song %q in items %+v", uniqueTitle, list.Items)
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
	var list struct {
		Items *[]struct {
			Title string `json:"title"`
		} `json:"items"`
		Total *int `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if list.Total == nil || *list.Total < 1 {
		t.Errorf("total = %v, want at least 1", list.Total)
	}
	found := false
	if list.Items != nil {
		for _, it := range *list.Items {
			if it.Title == "Any Song" {
				found = true
				break
			}
		}
	}
	if !found {
		t.Errorf("search by artist name: expected 'Any Song' in items %+v", list.Items)
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
	var list struct {
		Items *[]struct {
			Title string `json:"title"`
		} `json:"items"`
		Total *int `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if list.Total == nil || *list.Total < 5 {
		t.Errorf("total = %v, want at least 5", list.Total)
	}
	if list.Items == nil || len(*list.Items) != 2 {
		t.Errorf("items length = %d, want 2 (limit=2)", len(*list.Items))
	}
}
