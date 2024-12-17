// store/articlesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk: 사용자 게시글 가져오기
export const fetchUserArticles = createAsyncThunk(
  'articles/fetchUserArticles',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.bopcon.site/api/articles/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching articles');
    }
  }
);

// 초기 상태를 'articles'로 변경
const initialState = { 
  articles: [], 
  loading: false, 
  error: null 
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload; // 'data'에서 'articles'로 변경
      })
      .addCase(fetchUserArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default articlesSlice.reducer;
