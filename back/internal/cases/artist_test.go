package cases

import (
	"context"
	"errors"
	"testing"

	"github.com/Helltale/amdm-guitar-chords/back/internal/cases/testdata"
	"github.com/Helltale/amdm-guitar-chords/back/internal/entity"
	"github.com/google/uuid"
	"go.uber.org/mock/gomock"
)

func TestArtistCases_Create(t *testing.T) {
	ctx := context.Background()

	tests := []struct {
		name       string
		nameIn     string
		slugIn     string
		setupMocks func(*testdata.MockArtistRepository)
		wantErr    bool
		errIs      error
	}{
		{
			name:   "empty name",
			nameIn: "",
			slugIn: "artist",
			setupMocks: func(ar *testdata.MockArtistRepository) {
				// no calls
			},
			wantErr: true,
		},
		{
			name:       "empty slug",
			nameIn:     "Artist",
			slugIn:     "",
			setupMocks: func(ar *testdata.MockArtistRepository) {},
			wantErr:    true,
		},
		{
			name:       "invalid slug",
			nameIn:     "Artist",
			slugIn:     "bad slug!",
			setupMocks: func(ar *testdata.MockArtistRepository) {},
			wantErr:    true,
		},
		{
			name:   "duplicate slug",
			nameIn: "Artist",
			slugIn: "existing",
			setupMocks: func(ar *testdata.MockArtistRepository) {
				ar.EXPECT().GetBySlug(gomock.Any(), "existing").Return(&entity.Artist{
					ArtistID: uuid.New(),
					Name:     "Existing",
					Slug:     "existing",
				}, nil)
			},
			wantErr: true,
			errIs:   ErrDuplicateArtist,
		},
		{
			name:   "success",
			nameIn: "New Artist",
			slugIn: "new-artist",
			setupMocks: func(ar *testdata.MockArtistRepository) {
				ar.EXPECT().GetBySlug(gomock.Any(), "new-artist").Return(nil, nil)
				ar.EXPECT().Create(gomock.Any(), gomock.Any()).DoAndReturn(func(_ context.Context, a *entity.Artist) error {
					if a.Name != "New Artist" || a.Slug != "new-artist" {
						t.Errorf("Create artist = %+v", a)
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
			tt.setupMocks(ar)
			c := NewArtistCases(ar)
			got, err := c.Create(ctx, tt.nameIn, tt.slugIn)
			if (err != nil) != tt.wantErr {
				t.Errorf("Create() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errIs != nil && err != nil && !errors.Is(err, tt.errIs) {
				t.Errorf("Create() err = %v, want ErrIs %v", err, tt.errIs)
			}
			if !tt.wantErr && got == nil {
				t.Error("Create() returned nil artist")
			}
		})
	}
}

func TestArtistCases_List(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	ar := testdata.NewMockArtistRepository(ctrl)
	ar.EXPECT().List(gomock.Any(), 10, 0).Return([]*entity.Artist{}, int64(0), nil)
	c := NewArtistCases(ar)
	_, _, err := c.List(ctx, 10, 0)
	if err != nil {
		t.Errorf("List() err = %v", err)
	}
}

func TestArtistCases_GetBySlug(t *testing.T) {
	ctx := context.Background()
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()
	ar := testdata.NewMockArtistRepository(ctrl)
	ar.EXPECT().GetBySlug(gomock.Any(), "some-slug").Return(&entity.Artist{Name: "A", Slug: "some-slug"}, nil)
	c := NewArtistCases(ar)
	got, err := c.GetBySlug(ctx, "some-slug")
	if err != nil || got == nil || got.Slug != "some-slug" {
		t.Errorf("GetBySlug() = %v, %v", got, err)
	}
}
