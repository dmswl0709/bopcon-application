import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 네트워크 API에서 받아오는 payload 참고 후 맞춰서 작성
interface LoginPayload {
  token: string;
  refreshToken?: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  nickname: string | null;
}

// 초기 상태
const initialState: AuthState = {
  isLoggedIn: false, // 기본값
  token: null,
  refreshToken: null,
  nickname: null,
};

// Redux Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.nickname = action.payload.nickname;

      // AsyncStorage에 값 저장
      AsyncStorage.setItem('token', action.payload.token);
      if (action.payload.refreshToken) {
        AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      AsyncStorage.setItem('nickname', action.payload.nickname);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null;
      state.nickname = null;

      // AsyncStorage 값 삭제
      AsyncStorage.multiRemove(['token', 'refreshToken', 'nickname']);
    },
    loadAuthState: (state, action: PayloadAction<AuthState>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.nickname = action.payload.nickname;
    },
  },
});

export const { login, logout, loadAuthState } = authSlice.actions;
export default authSlice.reducer;

// 비동기 액션
export const loadAuthFromStorage = () => async (dispatch: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const nickname = await AsyncStorage.getItem('nickname');

    if (token) {
      dispatch(
        loadAuthState({
          isLoggedIn: true,
          token,
          refreshToken,
          nickname,
        })
      );
    }
  } catch (error) {
    console.error('Failed to load auth state from AsyncStorage:', error);
  }
};