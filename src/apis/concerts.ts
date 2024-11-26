import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Concert 데이터 타입 정의
export interface Concert {
  id: string;
  artistId: string;
  title: string;
  subTitle?: string;
  date: string;
  venueName: string;
  cityName: string;
  countryName: string;
  countryCode?: string;
  ticketUrl?: string;
  posterUrl?: string;
  genre?: string;
  concertStatus?: string;
  setlist?: string[];
}

// Axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Concert 목록 가져오기
export const fetchConcerts = async (): Promise<Concert[]> => {
  try {
    const response = await apiClient.get<Concert[]>("/api/new-concerts");
    return response.data.map((concert) => ({
      id: concert.newConcertId || concert.id, // ID 매핑
      artistId: concert.artistId,
      title: concert.title,
      subTitle: concert.subTitle,
      date: concert.date,
      venueName: concert.venueName,
      cityName: concert.cityName,
      countryName: concert.countryName,
      posterUrl: concert.posterUrl || "", // 포스터 URL 기본값
      ticketUrl: concert.ticketUrl,
      concertStatus: concert.concertStatus,
      genre: concert.genre,
    }));
  } catch (error) {
    console.error("Error fetching concerts:", error.message);
    throw new Error("Failed to fetch concert list");
  }
};

// Concert 단일 데이터 가져오기
export const fetchConcertData = async (concertId: string): Promise<Concert> => {
  try {
    const response = await apiClient.get<Concert>(`/api/new-concerts/${concertId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching concert data:", error.message);
    throw new Error("Failed to fetch concert data");
  }
};