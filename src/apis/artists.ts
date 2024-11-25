import axios from "axios";

// API URL의 기본 경로를 설정합니다. 환경변수에서 가져오거나 기본값으로 localhost 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 요청 제한 시간
  headers: {
    "Content-Type": "application/json",
  },
});

// 아티스트 데이터를 가져오는 함수
export const fetchArtistData = async (artistId?: string, artistName?: string) => {
  try {
    if (!artistId && !artistName) {
      throw new Error("artistId or artistName is required to fetch artist data.");
    }

    const endpoint = artistId
      ? `/api/artists/${artistId}`
      : `/api/artists/${encodeURIComponent(artistName || "")}`;

    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching artist data:", error);
    throw error;
  }
};