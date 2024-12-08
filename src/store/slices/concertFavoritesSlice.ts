import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Favorite {
  favoriteId: number;
  artistId: number | null;
  concertId: number | null;
}

interface ConcertFavoritesState {
  concertFavorites: Favorite[];
  loading: boolean;
  error: string | null;
}

const initialState: ConcertFavoritesState = {
  concertFavorites: [],
  loading: false,
  error: null,
};

const concertFavoritesSlice = createSlice({
  name: 'concertFavorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.concertFavorites = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      const exists = state.concertFavorites.some(
        (fav) =>
          fav.artistId === action.payload.artistId &&
          fav.concertId === action.payload.concertId
      );
      if (!exists) {
        state.concertFavorites.push(action.payload);
      }
    },
    removeFavorite: (
      state,
      action: PayloadAction<{ artistId?: number; concertId?: number }>
    ) => {
      state.concertFavorites = state.concertFavorites.filter(
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
} = concertFavoritesSlice.actions;

export default concertFavoritesSlice.reducer;
