
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchFavorites } from "../slices/favoritesSlice";
import { jwtDecode } from 'jwt-decode';


const API_BASE_URL = 'https://api.bopcon.site/api/auth';

// 회원가입 비동기 액션
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: { email: string; nickname: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('회원가입 요청 데이터:', formData);

      const response = await axios.post(`${API_BASE_URL}/signup`, formData);

      console.log('회원가입 응답 데이터:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[회원가입 오류]:', error?.response?.data?.error || error.message);
      return rejectWithValue(error?.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    }
  }
);

// 로그인 비동기 액션
// 로그인 비동기 액션
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      console.log("[로그인 응답 데이터]:", response.data);

      const { accessToken, nickname } = response.data;

      if (!accessToken || !nickname) {
        throw new Error("로그인 응답 데이터가 유효하지 않습니다.");
      }

      // 토큰 디코딩 후 id 추출
      const decodedToken: any = jwtDecode(accessToken);
      const id = decodedToken?.id;

      if (!id) {
        throw new Error("토큰에서 ID를 찾을 수 없습니다.");
      }

      console.log("[디코딩된 토큰 ID]:", id);

      console.log("[AsyncStorage에 저장 시작]:", { accessToken, id, nickname });

      await AsyncStorage.setItem("authToken", accessToken);
      await AsyncStorage.setItem("userNickname", nickname);
      await AsyncStorage.setItem("userId", id.toString());

      dispatch(fetchFavorites());

      return { token: accessToken, user: nickname, id: id };
    } catch (error) {
      return rejectWithValue("로그인 중 오류가 발생했습니다.");
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userNickname');
    await AsyncStorage.removeItem('userId'); // userId도 삭제 확인
    dispatch(logout()); // Redux 상태 초기화
  } catch (error: any) {
    console.error('[로그아웃 중 오류 발생]:', error.message);
  }
});

// 좋아요 상태 변경 (즐겨찾기 추가/삭제)
export const toggleFavoriteOnServer = createAsyncThunk(
  "auth/toggleFavorite",
  async (
    { id, type }: { id: number; type: "artist" | "concert" },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("로그인 토큰이 없습니다.");

      const endpoint =
        type === "artist"
          ? `${API_BASE_URL}/favorites/artist/${id}`
          : `${API_BASE_URL}/favorites/concert/${id}`;

      const response = await axios({
        method: "post",
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("즐겨찾기 요청 응답:", response.data);
      return { id, type };
    } catch (error: any) {
      console.error("[좋아요 요청 오류]:", error.message || error);
      return rejectWithValue("좋아요 요청 중 오류가 발생했습니다.");
    }
  }
);

// Redux Slice 생성
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    userId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAuthState(state, action) {
      console.log('[Redux 상태 업데이트 중 (setAuthState)]:', action.payload);
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
      state.userId = action.payload?.id || null;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.userId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.id;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '로그인 중 오류가 발생했습니다.';
      });
  },
});

export const { logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;