import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // React Native Alert 사용
import { navigate } from '../navigation/RootNavigation'; // RootNavigation 유틸리티로 페이지 이동 관리 (선택 사항)

// 환경 변수 또는 기본 URL 설정
const BASE_URL = 'http://localhost:8080';
const DEFAULT_TIMEOUT = 30000;

// Axios 클라이언트 설정
export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 추가
httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken'); // AsyncStorage에서 토큰 가져오기
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized 처리
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'nickname']); // AsyncStorage에서 인증 데이터 삭제
      Alert.alert('세션 만료', '다시 로그인 해주세요.'); // React Native Alert로 사용자 알림
      navigate('Login'); // RootNavigation으로 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

export default httpClient;