import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

// 회원가입 비동기 액션
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: { email: string; nickname: string; password: string }, { rejectWithValue }) => {
    try {
      // 요청 데이터 확인
      console.log('회원가입 요청 데이터:', formData);

      const response = await axios.post(`${API_BASE_URL}/signup`, formData);

      // 응답 데이터 확인
      console.log('회원가입 응답 데이터:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[회원가입 오류]:', error?.response?.data?.error || error.message);
      return rejectWithValue(error?.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    }
  }
);

// 로그인 비동기 액션
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      console.log("[로그인 응답 데이터]:", response.data);

      const { id, accessToken, nickname } = response.data; // 올바른 키로 매핑

      // 검증 로직
      if (!accessToken || !id || !nickname) {
        throw new Error("로그인 응답 데이터가 유효하지 않습니다.");
      }

      console.log("[AsyncStorage에 저장 시작]:", { accessToken, id, nickname });

      // AsyncStorage에 저장
      console.log('AsyncStorage에 저장할 토큰:', accessToken); // 저장하려는 토큰 확인
      await AsyncStorage.setItem("authToken", accessToken);
      await AsyncStorage.setItem("userNickname", nickname);
      await AsyncStorage.setItem("userId", id.toString()); // 숫자를 문자열로 변환하여 저장

      // 저장된 데이터 확인
      const storedToken = await AsyncStorage.getItem("authToken");
      console.log('AsyncStorage에 저장된 토큰:', storedToken); // 저장된 토큰 확인
      const storedNickname = await AsyncStorage.getItem("userNickname");
      const storedUserId = await AsyncStorage.getItem("userId");

      console.log("[저장된 AsyncStorage 데이터]:", {
        storedToken,
        storedNickname,
        storedUserId,
      });

      return { token: storedToken, user: storedNickname, id: storedUserId };
    } catch (error) {
      console.error("[로그인 실패]:", error.message || error);
      return rejectWithValue("로그인 중 오류가 발생했습니다.");
    }
  }
);

// 로그아웃 비동기 액션
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authId');
    await AsyncStorage.removeItem('authUser');
    dispatch(logout());
  } catch (error: any) {
    console.error('[로그아웃 중 오류 발생]:', error.message);
  }
});

// Redux Slice 생성
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    userId: null,
    favorites: {
      artists: [], // 빈 배열로 초기화
      concerts: [], // 빈 배열로 초기화
    },
    loading: false,
    error: null,
  },
  reducers: {
    setAuthState(state, action) {
      console.log('[Redux 상태 업데이트 중 (setAuthState)]:', action.payload);
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
      state.userId = action.payload?.id || null; // userId를 id로 업데이트
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
        console.log('[Redux 상태 업데이트 (fulfilled)]:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.id; // userId를 id로 업데이트
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '로그인 중 오류가 발생했습니다.';
      });
  },
});
// 좋아요 상태 변경 (즐겨찾기 추가/삭제)
export const toggleFavoriteOnServer = createAsyncThunk(
  "auth/toggleFavorite",
  async (
    { id, type }: { id: number; type: "artist" | "concert" },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("로그인 토큰이 없습니다.");

      const endpoint =
        type === "artist"
          ? `${API_BASE_URL}/favorites/artist/${id}`
          : `${API_BASE_URL}/favorites/concert/${id}`;

      const method = type === "artist" ? "post" : "delete";
      const response = await axios({
        method,
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

// 액션 및 리듀서 내보내기
export const { logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;
