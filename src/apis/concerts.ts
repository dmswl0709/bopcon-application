// /src/apis/concerts.ts
import axios from 'axios';

// Concert 데이터 인터페이스 정의
export interface ConcertData {
  id: string;
  title: string;
  subTitle?: string; // 선택적 속성
  date: string;
  venueName: string;
  cityName: string;
  countryName: string;
  ticketUrl?: string; // 선택적 속성
  posterUrl?: string; // 선택적 속성
  setlist?: string[]; // 예상 셋리스트
  [key: string]: any; // 기타 동적 속성 허용
}

// Axios 인스턴스 생성 (baseURL, timeout, headers 등 설정)
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  timeout: 5000, // 요청 제한 시간
  headers: {
    'Content-Type': 'application/json',
  },
});

// 콘서트 데이터 가져오기 함수
export const fetchConcertData = async (concertId: string): Promise<ConcertData> => {
  try {
    const response = await apiClient.get<ConcertData>(`/api/new-concerts/${concertId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching concert data for ID: ${concertId}`, error);
    throw new Error('Failed to fetch concert data');
  }
};

// 아티스트 데이터 가져오기 함수 추가
export const fetchArtistData = async (artistName: string): Promise<any> => {
    try {
      if (!artistName) {
        console.error("artistName is missing or invalid:", artistName);
        throw new Error("artistName is required");
      }
  
      // URL 인코딩
      const encodedArtistName = encodeURIComponent(artistName);
      console.log("Fetching data for artistName:", artistName);
      console.log("Encoded URL:", `/api/artists/${encodedArtistName}`);
  
      const response = await apiClient.get(`/api/artists/${encodedArtistName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artist data for Name: ${artistName}`, error);
      throw new Error('Failed to fetch artist data');
    }
  };

// 추가적으로 필요한 API 함수가 있다면 여기서 정의할 수 있음