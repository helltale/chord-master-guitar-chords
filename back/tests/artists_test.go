//go:build integration

package tests

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"
)

func TestArtists_ListEmpty(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase

	resp, err := server.Client().Get(base + "/artists")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Errorf("GET /artists: status = %d, want 200", resp.StatusCode)
	}
	var list struct {
		Items *[]struct {
			ArtistId string `json:"artist_id"`
			Name     string `json:"name"`
			Slug     string `json:"slug"`
		} `json:"items"`
		Total *int `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal("decode:", err)
	}
	if list.Items == nil {
		list.Items = &[]struct {
			ArtistId string `json:"artist_id"`
			Name     string `json:"name"`
			Slug     string `json:"slug"`
		}{}
	}
	if len(*list.Items) != 0 {
		t.Errorf("items length = %d, want 0", len(*list.Items))
	}
	if list.Total == nil || *list.Total != 0 {
		t.Errorf("total = %v, want 0", list.Total)
	}
}

func TestArtists_CreateSuccess(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	body := `{"name":"Test Artist","slug":"test-artist"}`
	resp, err := client.Post(base+"/artists", "application/json", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusCreated {
		t.Errorf("POST /artists: status = %d, want 201", resp.StatusCode)
	}
	var artist struct {
		ArtistId string `json:"artist_id"`
		Name     string `json:"name"`
		Slug     string `json:"slug"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&artist); err != nil {
		t.Fatal("decode:", err)
	}
	if artist.Name != "Test Artist" || artist.Slug != "test-artist" || artist.ArtistId == "" {
		t.Errorf("artist = %+v", artist)
	}

	// GetBySlug возвращает того же артиста
	getResp, err := client.Get(base + "/artists/test-artist")
	if err != nil {
		t.Fatal(err)
	}
	defer getResp.Body.Close()
	if getResp.StatusCode != http.StatusOK {
		t.Errorf("GET /artists/test-artist: status = %d, want 200", getResp.StatusCode)
	}
	var withSongs struct {
		ArtistId string `json:"artist_id"`
		Name     string `json:"name"`
		Slug     string `json:"slug"`
		Songs    *[]any `json:"songs"`
	}
	if err := json.NewDecoder(getResp.Body).Decode(&withSongs); err != nil {
		t.Fatal("decode get:", err)
	}
	if withSongs.Slug != "test-artist" || withSongs.Name != "Test Artist" {
		t.Errorf("get by slug = %+v", withSongs)
	}
	if withSongs.Songs == nil {
		t.Error("songs field should be present (may be empty)")
	}
}

func TestArtists_CreateDuplicateSlug_Returns400(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	body := `{"name":"First","slug":"same-slug"}`
	resp1, err := client.Post(base+"/artists", "application/json", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	resp1.Body.Close()
	if resp1.StatusCode != http.StatusCreated {
		t.Fatalf("first create: status = %d, want 201", resp1.StatusCode)
	}

	resp2, err := client.Post(base+"/artists", "application/json", strings.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	defer resp2.Body.Close()
	if resp2.StatusCode != http.StatusBadRequest {
		t.Errorf("second create (duplicate slug): status = %d, want 400", resp2.StatusCode)
	}
}

func TestArtists_CreateValidation_Returns400(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	tests := []struct {
		name string
		body string
	}{
		{"empty name", `{"name":"","slug":"ok-slug"}`},
		{"empty slug", `{"name":"Name","slug":""}`},
		{"invalid slug", `{"name":"Name","slug":"bad slug!"}`},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := client.Post(base+"/artists", "application/json", strings.NewReader(tt.body))
			if err != nil {
				t.Fatal(err)
			}
			defer resp.Body.Close()
			if resp.StatusCode != http.StatusBadRequest {
				t.Errorf("status = %d, want 400", resp.StatusCode)
			}
		})
	}
}

func TestArtists_GetBySlug_NotFound_Returns404(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase

	resp, err := server.Client().Get(base + "/artists/non-existent-slug-12345")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("GET /artists/non-existent: status = %d, want 404", resp.StatusCode)
	}
}

func TestArtists_ListPagination(t *testing.T) {
	server := NewTestServer(t)
	defer server.Close()
	base := server.URL + apiBase
	client := server.Client()

	// Создаём 3 артиста с разными именами (порядок по name)
	for _, name := range []string{"Charlie", "Alice", "Bob"} {
		slug := strings.ToLower(name)
		body := `{"name":"` + name + `","slug":"` + slug + `"}`
		resp, err := client.Post(base+"/artists", "application/json", strings.NewReader(body))
		if err != nil {
			t.Fatal(err)
		}
		resp.Body.Close()
		if resp.StatusCode != http.StatusCreated {
			t.Fatalf("create %s: status = %d", name, resp.StatusCode)
		}
	}

	// limit=2, offset=1 → порядок по name: Alice, Bob, Charlie → ожидаем Bob, Charlie
	resp, err := client.Get(base + "/artists?limit=2&offset=1")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("list: status = %d", resp.StatusCode)
	}
	var list struct {
		Items *[]struct {
			Name string `json:"name"`
		}
		Total *int `json:"total"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&list); err != nil {
		t.Fatal(err)
	}
	if list.Total == nil || *list.Total < 3 {
		t.Errorf("total = %v, want at least 3", list.Total)
	}
	if list.Items == nil || len(*list.Items) != 2 {
		t.Errorf("items length = %d, want 2", len(*list.Items))
	}
	names := make([]string, len(*list.Items))
	for i, it := range *list.Items {
		names[i] = it.Name
	}
	if names[0] != "Bob" || names[1] != "Charlie" {
		t.Errorf("items order = %v, want [Bob, Charlie]", names)
	}
}
