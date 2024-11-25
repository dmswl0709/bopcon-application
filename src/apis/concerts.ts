import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Concert 데이터 타입 정의
export interface Concert {
  id: string;
  posterUrl: string | any; // URL 또는 로컬 리소스
  title: string;
  date: string;
  venueName: string;
  cityName: string;
  countryName: string;
}

// Axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Concerts 데이터 가져오기
export const fetchConcerts = async (): Promise<Concert[]> => {
  try {
    const response = await apiClient.get<Concert[]>("/api/new-concerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching concerts:", error);
    throw new Error("Failed to fetch concerts");
  }
};

// Sample Concert 데이터 (임시 데이터)
export const sampleConcerts: Concert[] = [
  {
    id: "1",
    posterUrl: require("../assets/images/sampleimg1.jpg"), // 로컬 리소스
    title: "임시 콘서트 1",
    date: "2024-12-01",
    venueName: "서울 월드컵 경기장",
    cityName: "서울",
    countryName: "대한민국",
  },
  {
    id: "2",
    posterUrl: require("../assets/images/sampleimg2.png"), // 로컬 리소스
    title: "임시 콘서트 2",
    date: "2024-12-10",
    venueName: "부산 아시아드 주경기장",
    cityName: "부산",
    countryName: "대한민국",
  },
  {
    id: "3",
    posterUrl: require("../assets/images/sampleimg3.png"), // 로컬 리소스
    title: "임시 콘서트 3",
    date: "2024-12-20",
    venueName: "인천 문학 경기장",
    cityName: "인천",
    countryName: "대한민국",
  },
];