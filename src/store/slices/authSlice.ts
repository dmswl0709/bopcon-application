import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

// 회원가입 비동기 액션
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: { email: string; nickname: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error || '회원가입 중 오류가 발생했습니다.');
    }
  }
);

// 로그인 비동기 액션
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data; // 응답 데이터를 Redux 상태에 저장
    } catch (error: any) {
      return rejectWithValue(error.response.data.error || '로그인 중 오류가 발생했습니다.');
    }
  }
);

// Redux Slice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload; // 회원가입 완료 후 사용자 정보 저장
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.nickname;
        state.token = action.payload.accessToken; // 로그인 완료 후 토큰 저장
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
