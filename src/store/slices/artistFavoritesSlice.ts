import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Favorite {
  favoriteId: number;
  artistId: number | null;
  concertId: number | null;
}

interface ArtistFavoritesState {
  artistFavorites: Favorite[];
  loading: boolean;
  error: string | null;
  token: string | null; // 사용자 토큰 추가
}

const initialState: ArtistFavoritesState = {
  artistFavorites: [],
  loading: false,
  error: null,
  token: null,
};

// 서버에서 즐겨찾기 데이터를 가져오는 비동기 액션
export const fetchFavorites = createAsyncThunk(
  'artistFavorites/fetchFavorites',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.bopcon.site/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // 서버에서 받은 즐겨찾기 데이터
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '즐겨찾기 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  }
);

// 즐겨찾기를 추가하는 비동기 액션
export const addFavoriteAsync = createAsyncThunk(
  'artistFavorites/addFavorite',
  async ({ favorite, token }: { favorite: Favorite; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://api.bopcon.site/api/favorites',
        favorite,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // 서버에서 추가된 즐겨찾기 데이터
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '즐겨찾기를 추가하는 중 오류가 발생했습니다.');
    }
  }
);

const artistFavoritesSlice = createSlice({
  name: 'artistFavorites',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // 사용자 토큰 설정
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.artistFavorites = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.artistFavorites.push(action.payload); // 서버에서 반환된 데이터 추가
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// 액션과 리듀서 내보내기
export const { setToken } = artistFavoritesSlice.actions;
export default artistFavoritesSlice.reducer;