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
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      console.log('[로그인 응답 데이터]:', response.data);

      const { accessToken, nickname} = response.data;

      // 데이터 검증
      if (!accessToken || typeof accessToken !== 'string') {
        console.error('[유효하지 않은 accessToken]:', accessToken);
        throw new Error(`유효하지 않은 accessToken: ${accessToken}`);
      }
      if (!nickname || typeof nickname !== 'string') {
        console.error('[유효하지 않은 nickname]:', nickname);
        throw new Error(`유효하지 않은 nickname: ${nickname}`);
      }

      console.log('[AsyncStorage에 저장 시작]:', { accessToken, nickname});

      // AsyncStorage 저장
      await AsyncStorage.setItem('authToken', accessToken);
      await AsyncStorage.setItem('userNickname', nickname);


      // AsyncStorage에 저장된 데이터 확인
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedNickname = await AsyncStorage.getItem('userNickname');
      const storedUserId = await AsyncStorage.getItem('userId');

      console.log('[저장된 AsyncStorage 데이터]:', { storedToken, storedNickname, storedUserId });

      // 검증 실패 시 예외 처리
      if (!storedToken || !storedNickname) {
        console.error('[AsyncStorage 저장 실패]: 저장된 값이 유효하지 않습니다.');
        throw new Error('AsyncStorage 저장 실패: 저장된 값이 undefined');
      }

      return { token: storedToken, user: storedNickname };
    } catch (error: any) {
      // console.error('[로그인 실패]:', error.message || error);
      return rejectWithValue(error?.response?.data?.error || '로그인 중 오류가 발생했습니다.');
    }
  }
);

// 로그아웃 비동기 액션
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    console.log('[로그아웃]: AsyncStorage에서 항목 제거 시작');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userNickname');
    console.log('[로그아웃]: AsyncStorage 항목 제거 완료');

    dispatch(logout());
  } catch (error: any) {
    console.error('[로그아웃 중 오류 발생]:', error.message);
  }
});

// Redux Slice 생성
const authSlice = createSlice({
  name: 'auth',
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
      state.userId = action.payload.userId || null; // 추가
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('[Redux 상태 업데이트 (fulfilled)]:', action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '로그인 중 오류가 발생했습니다.';
        // console.error('[로그인 실패 Redux 상태 업데이트]:', action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || '회원가입 중 오류가 발생했습니다.';
        console.error('[회원가입 실패 Redux 상태 업데이트]:', action.payload);
      });
  },
});

// 액션 및 리듀서 내보내기
export const { logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;
