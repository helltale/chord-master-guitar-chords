package cases //nolint:testpackage // нужен доступ к &SongCases{songRepo} для Update/Transpose/Search

import (
	"context"
	"errors"
	"testing"

	"github.com/Helltale/amdm-guitar-chords/back/internal/cases/testdata"
	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/Helltale/amdm-guitar-chords/back/internal/repository"
	"github.com/google/uuid"
	"go.uber.org/mock/gomock"
)

func TestSongCases_Create(t *testing.T) {
	artistID := uuid.MustParse("11111111-1111-1111-1111-111111111111")
	ctx := context.Background()

	tests := []struct {
		name       string
		artistID   uuid.UUID
		title      string
		slug       string
		tonality   int
		content    entity.TabContent
		setupMocks func(*testdata.MockArtistRepository, *testdata.MockSongRepository)
		wantErr    bool
		errIs      error
	}{
		{
			name:     "empty title",
			artistID: artistID,
			title:    "",
			slug:     "my-song",
			setupMocks: func(_ *testdata.MockArtistRepository, _ *testdata.MockSongRepository) {
				// no repo calls
			},
			wantErr: true,
			errIs:   nil,
		},
		{
			name:     "empty slug",
			artistID: artistID,
			title:    "My Song",
			slug:     "",
			setupMocks: func(_ *testdata.MockArtistRepository, _ *testdata.MockSongRepository) {
				// no repo calls
			},
			wantErr: true,
		},
		{
			name:       "invalid slug chars",
			artistID:   artistID,
			title:      "My Song",
			slug:       "my song!",
			setupMocks: func(_ *testdata.MockArtistRepository, _ *testdata.MockSongRepository) {},
			wantErr:    true,
		},
		{
			name:     "artist not found",
			artistID: artistID,
			title:    "My Song",
			slug:     "my-song",
			setupMocks: func(ar *testdata.MockArtistRepository, _ *testdata.MockSongRepository) {
				ar.EXPECT().GetByID(gomock.Any(), artistID).Return(nil, repository.ErrNotFound)
			},
			wantErr: true,
		},
		{
			name:     "duplicate slug",
			artistID: artistID,
			title:    "My Song",
			slug:     "my-song",
			setupMocks: func(ar *testdata.MockArtistRepository, sr *testdata.MockSongRepository) {
				ar.EXPECT().GetByID(gomock.Any(), artistID).
					Return(&entity.Artist{ArtistID: artistID, Name: "A", Slug: "a"}, nil)
				sr.EXPECT().GetByArtistIDAndSlug(gomock.Any(), artistID, "my-song").
					Return(&entity.Song{}, nil)
			},
			wantErr: true,
			errIs:   ErrDuplicateSong,
		},
		{
			name:     "success",
			artistID: artistID,
			title:    "My Song",
			slug:     "my-song",
			tonality: 2,
			setupMocks: func(ar *testdata.MockArtistRepository, sr *testdata.MockSongRepository) {
				ar.EXPECT().GetByID(gomock.Any(), artistID).
					Return(&entity.Artist{ArtistID: artistID, Name: "A", Slug: "a"}, nil)
				sr.EXPECT().GetByArtistIDAndSlug(gomock.Any(), artistID, "my-song").
					Return(nil, repository.ErrNotFound)
				sr.EXPECT().Create(gomock.Any(), gomock.Any()).
					DoAndReturn(func(_ context.Context, s *entity.Song) error {
						if s.Title != "My Song" || s.Slug != "my-song" || s.Tonality != 2 {
							t.Errorf("Create called with wrong song: %+v", s)
						}
						return nil
					})
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			ar := testdata.NewMockArtistRepository(ctrl)
			sr := testdata.NewMockSongRepository(ctrl)
			tt.setupMocks(ar, sr)
			c := NewSongCases(ar, sr, nil)
			got, err := c.Create(ctx, tt.artistID, tt.title, tt.slug, tt.tonality, tt.content)
			if (err != nil) != tt.wantErr {
				t.Errorf("Create() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errIs != nil && err != nil && !errors.Is(err, tt.errIs) {
				t.Errorf("Create() err = %v, want ErrIs %v", err, tt.errIs)
			}
			if !tt.wantErr && got == nil {
				t.Error("Create() returned nil song")
			}
		})
	}
}

func TestSongCases_Update(t *testing.T) {
	songID := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	ctx := context.Background()

	tests := []struct {
		name       string
		id         uuid.UUID
		title      *string
		slug       *string
		tonality   *int
		content    *entity.TabContent
		setupMocks func(*testdata.MockSongRepository)
		wantErr    bool
		errIs      error
	}{
		{
			name: "song not found",
			id:   songID,
			setupMocks: func(sr *testdata.MockSongRepository) {
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(nil, repository.ErrNotFound)
			},
			wantErr: true,
			errIs:   repository.ErrNotFound,
		},
		{
			name:  "empty title",
			id:    songID,
			title: strPtr("   "),
			setupMocks: func(sr *testdata.MockSongRepository) {
				oldSong := &entity.Song{SongID: songID, Title: "Old", Slug: "old"}
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(oldSong, nil)
			},
			wantErr: true,
		},
		{
			name: "empty slug",
			id:   songID,
			slug: strPtr(""),
			setupMocks: func(sr *testdata.MockSongRepository) {
				oldSong := &entity.Song{SongID: songID, Title: "Old", Slug: "old"}
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(oldSong, nil)
			},
			wantErr: true,
		},
		{
			name: "invalid slug",
			id:   songID,
			slug: strPtr("bad slug!"),
			setupMocks: func(sr *testdata.MockSongRepository) {
				oldSong := &entity.Song{SongID: songID, Title: "Old", Slug: "old"}
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(oldSong, nil)
			},
			wantErr: true,
		},
		{
			name:  "success update title",
			id:    songID,
			title: strPtr("New Title"),
			setupMocks: func(sr *testdata.MockSongRepository) {
				s := &entity.Song{SongID: songID, Title: "Old", Slug: "old"}
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(s, nil)
				sr.EXPECT().Update(gomock.Any(), gomock.Any()).
					DoAndReturn(func(_ context.Context, s *entity.Song) error {
						if s.Title != "New Title" {
							t.Errorf("Update title = %q, want New Title", s.Title)
						}
						return nil
					})
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			sr := testdata.NewMockSongRepository(ctrl)
			tt.setupMocks(sr)
			c := NewSongCases(nil, sr, nil)
			if c.artistRepo != nil {
				t.Skip("NewSongCases requires artistRepo; use interface cast for Update-only tests")
			}
			// Update only uses songRepo
			c = &SongCases{songRepo: sr}
			_, err := c.Update(ctx, tt.id, tt.title, tt.slug, tt.tonality, tt.content)
			if (err != nil) != tt.wantErr {
				t.Errorf("Update() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errIs != nil && err != nil && !errors.Is(err, tt.errIs) {
				t.Errorf("Update() err = %v, want ErrIs %v", err, tt.errIs)
			}
		})
	}
}

func TestSongCases_Transpose(t *testing.T) {
	songID := uuid.MustParse("33333333-3333-3333-3333-333333333333")
	ctx := context.Background()

	tests := []struct {
		name       string
		songID     uuid.UUID
		semitones  int
		setupMocks func(*testdata.MockSongRepository)
		wantErr    bool
	}{
		{
			name:   "not found",
			songID: songID,
			setupMocks: func(sr *testdata.MockSongRepository) {
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(nil, repository.ErrNotFound)
			},
			wantErr: true,
		},
		{
			name:      "success",
			songID:    songID,
			semitones: 2,
			setupMocks: func(sr *testdata.MockSongRepository) {
				sr.EXPECT().GetByID(gomock.Any(), songID).Return(&entity.Song{
					SongID:   songID,
					Tonality: 0,
					Content: entity.TabContent{
						Sections: []entity.Section{
							{ChordSequence: []string{"C"}, Blocks: []entity.Block{}},
						},
					},
				}, nil)
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			sr := testdata.NewMockSongRepository(ctrl)
			tt.setupMocks(sr)
			c := &SongCases{songRepo: sr}
			got, err := c.Transpose(ctx, tt.songID, tt.semitones)
			if (err != nil) != tt.wantErr {
				t.Errorf("Transpose() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && (got == nil || got.Tonality != tt.semitones) {
				t.Errorf("Transpose() tonality = %v, want %d", got, tt.semitones)
			}
		})
	}
}

func TestSongCases_Search(t *testing.T) {
	ctx := context.Background()

	tests := []struct {
		name      string
		query     string
		limit     int
		offset    int
		wantCalls bool
	}{
		{"empty query", "", 10, 0, false},
		{"whitespace only", "   ", 10, 0, false},
		{"normal query", "foo", 10, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			sr := testdata.NewMockSongRepository(ctrl)
			if tt.wantCalls {
				sr.EXPECT().Search(gomock.Any(), "foo", tt.limit, tt.offset).Return(nil, int64(0), nil)
			}
			c := &SongCases{songRepo: sr}
			list, total, err := c.Search(ctx, tt.query, tt.limit, tt.offset)
			if err != nil {
				t.Errorf("Search() err = %v", err)
			}
			if !tt.wantCalls {
				if list != nil || total != 0 {
					t.Errorf("Search(empty) = %v, %d; want nil, 0", list, total)
				}
			}
		})
	}
}

func strPtr(s string) *string { return &s }
