import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://api.bopcon.site/api', // API의 기본 URL 설정
  timeout: 5000, // 요청 제한 시간 설정 (5초)
});

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // AsyncStorage에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 요청 헤더에 Authorization 추가
    }
    return config; // 수정된 요청을 반환
  },
  (error) => {
    return Promise.reject(error); // 요청 중 오류가 발생하면 거부
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response; // 응답이 정상적일 경우 그대로 반환
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 401 상태 코드(인증 오류)가 발생하면
      await AsyncStorage.clear(); // 저장된 토큰 삭제
      console.error('401 오류: 인증 실패. 토큰이 만료되었거나 유효하지 않습니다.');
    }
    return Promise.reject(error); // 오류를 거부하고 상위로 전달
  }
);

export default api; // 생성한 Axios 인스턴스를 내보내기
