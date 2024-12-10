import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserArticles = createAsyncThunk(
  'articles/fetchUserArticles',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8080/api/articles/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Error fetching articles');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default articlesSlice.reducer;
