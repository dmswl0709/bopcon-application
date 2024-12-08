import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Favorite {
  favoriteId: number;
  artistId: number | null;
  concertId: number | null;
}

interface ArtistFavoritesState {
  artistFavorites: Favorite[];
  loading: boolean;
  error: string | null;
}

const initialState: ArtistFavoritesState = {
  artistFavorites: [],
  loading: false,
  error: null,
};

const artistFavoritesSlice = createSlice({
  name: 'artistFavorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.artistFavorites = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      const exists = state.artistFavorites.some(
        (fav) =>
          fav.artistId === action.payload.artistId &&
          fav.concertId === action.payload.concertId
      );
      if (!exists) {
        state.artistFavorites.push(action.payload);
      }
    },
    removeFavorite: (
      state,
      action: PayloadAction<{ artistId?: number; concertId?: number }>
    ) => {
      state.artistFavorites = state.artistFavorites.filter(
        (fav) =>
          !(
            fav.artistId === action.payload.artistId ||
            fav.concertId === action.payload.concertId
          )
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFavorites,
  addFavorite,
  removeFavorite,
  setLoading,
  setError,
} = artistFavoritesSlice.actions;

export default artistFavoritesSlice.reducer;
