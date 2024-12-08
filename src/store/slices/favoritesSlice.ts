import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 아티스트와 콘서트를 위한 기본 상태 구조
interface FavoriteState {
  artists: { id: number; name: string; favoriteId: number }[];
  concerts: { id: number; title: string; favoriteId: number }[];
}

const initialState: FavoriteState = {
  artists: [],
  concerts: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<{ id: number; type: "artist" | "concert" }>) => {
      const { id, type } = action.payload;
      if (type === "artist") {
        const artistIndex = state.artists.findIndex((artist) => artist.favoriteId === id);
        if (artistIndex === -1) {
          // 즐겨찾기에 추가
          state.artists.push({ id, name: `Artist ${id}`, favoriteId: id });
        } else {
          // 즐겨찾기에서 제거
          state.artists.splice(artistIndex, 1);
        }
      } else if (type === "concert") {
        const concertIndex = state.concerts.findIndex((concert) => concert.favoriteId === id);
        if (concertIndex === -1) {
          // 즐겨찾기에 추가
          state.concerts.push({ id, title: `Concert ${id}`, favoriteId: id });
        } else {
          // 즐겨찾기에서 제거
          state.concerts.splice(concertIndex, 1);
        }
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;