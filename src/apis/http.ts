import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // React Native Alert 사용
import { navigate } from '../navigation/RootNavigation'; // RootNavigation 유틸리티로 페이지 이동 관리 (선택 사항)

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080', // 기본 URL
  // timeout: DEFAULT_TIMEOUT, // 요청 제한 시간 (ms)
  headers: {
    'Content-Type': 'application/json', // 기본 헤더
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

    // **ConcertScreen 관련 추가 처리**
    if (error.response?.status === 404) {
      // 404 Not Found 처리
      Alert.alert('데이터를 찾을 수 없습니다.', '콘서트 데이터를 다시 확인해주세요.');
    }

    // 추가 에러 처리 가능
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default httpClient;