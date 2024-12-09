import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FavoriteState {
  userId: number | null;
  artists: { id: number; name: string; favoriteId: number }[];
  concerts: { id: number; title: string; favoriteId: number }[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  userId: null,
  artists: [],
  concerts: [],
  loading: false,
  error: null,
};

// 서버에서 즐겨찾기 데이터 가져오기
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8080/api/favorites");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "데이터를 가져오는 중 오류 발생");
    }
  }
);

const toggleItem = (
  items: { id: number; name?: string; title?: string; favoriteId: number }[],
  id: number,
  type: "artist" | "concert"
) => {
  const index = items.findIndex((item) => item.favoriteId === id);
  if (index === -1) {
    items.push({
      id,
      ...(type === "artist" ? { name: `Artist ${id}` } : { title: `Concert ${id}` }),
      favoriteId: id,
    });
  } else {
    items.splice(index, 1);
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<{ id: number; type: "artist" | "concert" }>) => {
      const { id, type } = action.payload;
      if (type === "artist") {
        toggleItem(state.artists, id, "artist");
      } else if (type === "concert") {
        toggleItem(state.concerts, id, "concert");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.artists = action.payload.artists;
        state.concerts = action.payload.concerts;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;