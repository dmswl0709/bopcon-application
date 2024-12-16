import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// 서버에서 즐겨찾기 목록 가져오기
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("로그인 토큰이 없습니다.");

      const response = await axios.get("https://api.bopcon.site/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "데이터를 가져오는 중 오류 발생"
      );
    }
  }
);

// 즐겨찾기 추가/삭제 요청
export const toggleFavoriteOnServer = createAsyncThunk(
  "favorites/toggleFavorite",
  async (
    {
      id,
      type,
      isFavorite,
    }: { id: number; type: "artist" | "concert"; isFavorite: boolean },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("로그인 토큰이 없습니다.");

      const endpoint =
        type === "artist"
          ? `https://api.bopcon.site/api/favorites/artist/${id}`
          : `https://api.bopcon.site/api/favorites/concert/${id}`;

      console.log(
        `${isFavorite ? "삭제" : "추가"} 요청 시작 - 엔드포인트: ${endpoint}`
      );

      if (isFavorite) {
        // 삭제 요청
        const response = await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("즐겨찾기 삭제 응답:", response.data);
      } else {
        // 추가 요청
        const requestData =
          type === "artist"
            ? { artistId: id, newConcertId: null }
            : { artistId: null, newConcertId: id };

        console.log("추가 요청 데이터:", requestData);

        const response = await axios.post(endpoint, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("즐겨찾기 추가 응답:", response.data);
      }

      // 상태 업데이트를 위해 id와 type 반환
      return { id, type, isFavorite };
    } catch (error: any) {
      console.error("[좋아요 요청 오류]:", error.response?.data || error.message || error);
      return rejectWithValue("좋아요 요청 중 오류가 발생했습니다.");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteOnServer.fulfilled, (state, action) => {
        const { id, type, isFavorite } = action.payload;

        if (type === "artist") {
          if (isFavorite) {
            state.artists = state.artists.filter((fav) => fav.favoriteId !== id);
          } else {
            state.artists.push({ id, name: `Artist ${id}`, favoriteId: id });
          }
        } else if (type === "concert") {
          if (isFavorite) {
            state.concerts = state.concerts.filter((fav) => fav.favoriteId !== id);
          } else {
            state.concerts.push({ id, title: `Concert ${id}`, favoriteId: id });
          }
        }
      })
      .addCase(toggleFavoriteOnServer.rejected, (state, action) => {
        console.error("즐겨찾기 요청 오류:", action.payload);
        state.error = action.payload as string;
      });
  },
});

export default favoritesSlice.reducer;