import axios from "axios";

// React Native 환경에 맞는 API Base URL 설정
// localhost 대신 실제 서버 IP 주소를 사용해야 함
const API_BASE_URL = "https://api.bopcon.site"; // 컴퓨터의 로컬 IP 주소로 변경 필요

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // 요청 제한 시간 설정
});

// 로그인 요청
export const login = async (email: string, password: string) => {
  try {
    console.log("로그인 요청 데이터:", { email, password }); // 요청 데이터 로그
    const response = await apiClient.post("/api/auth/login", { email, password });
    console.log("로그인 성공:", response.data); // 응답 데이터 로그
    return response.data;
  } catch (error: any) {
    console.error("로그인 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 회원가입 요청
export const signup = async ({
  email,
  password,
  confirmPassword,
  nickname,
}: {
  email: string;
  password: string;
  confirmPassword: string; // 추가
  nickname: string;
}) => {
  try {
    console.log("회원가입 요청 데이터:", { email, password, confirmPassword, nickname });

    const response = await apiClient.post("/api/auth/signup", {
      email,
      nickname,
      password,
      confirmPassword, // 추가
    });

    console.log("회원가입 응답 데이터:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    throw error;
  }
};


// 로그아웃 요청
export const logout = async () => {
  try {
    console.log("로그아웃 요청");
    const response = await apiClient.post("/api/auth/logout");
    console.log("로그아웃 성공");
    return response.data;
  } catch (error: any) {
    console.error("로그아웃 실패:", error.response?.data || error.message);
    throw error;
  }
};
