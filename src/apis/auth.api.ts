import { httpClient } from './http'; // Axios 클라이언트
import { JoinProps } from '../types/JoinProps'; // 회원가입 데이터 타입 (필요시 정의)

// 회원가입 API 호출
export const signup = async (userData: JoinProps): Promise<void> => {
  try {
    const response = await httpClient.post('/api/auth/signup', userData);
    return response.data; // 성공 응답 반환
  } catch (error: any) {
    console.error('회원가입 실패:', error);
    throw error; // 에러를 상위 호출부로 전달
  }
};

// 로그인 응답 타입 정의
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  nickname: string;
}

// 로그인 API 호출
export const login = async (data: Omit<JoinProps, 'nickname'>): Promise<LoginResponse> => {
  try {
    const response = await httpClient.post<LoginResponse>('/api/auth/login', data);
    return response.data; // 성공 응답 반환
  } catch (error: any) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 토큰 갱신 API 호출 (선택 사항)
export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const response = await httpClient.post<LoginResponse>('/api/auth/refresh');
    return response.data;
  } catch (error: any) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};