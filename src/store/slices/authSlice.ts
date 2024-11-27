import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 초기 상태 정의
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  nickname: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  nickname: null,
};

// Auth Slice 생성
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ accessToken: string; refreshToken: string; nickname: string }>) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.nickname = action.payload.nickname;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.nickname = null;
    },
  },
});

// 액션과 리듀서를 내보냄
export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;