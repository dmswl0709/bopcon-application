import axios from "axios";

// API Base URL 설정
const API_BASE_URL = "http://localhost:8080";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// 로그인 요청
export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/api/auth/login", { email, password });
  return response.data;
};

// 파일명: src/apis/auth.ts
export const signup = async ({ email, password, nickname }: { email: string; password: string; nickname: string }) => {
  try {
    const passwordRules = "at least 8 characters"; // 명세에 따라 고정된 값 설정
    const response = await axios.post('/api/auth/signup', {
      email,
      nickname,
      password,
      password_rules: passwordRules, // 필드 추가
    });
    return response.data;
  } catch (error: any) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw error;
  }
};
// 로그아웃 요청
export const logout = async () => {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
};