import axios from "axios";

// API 기본 URL을 설정하세요
const API_BASE_URL = "https://api.bopcon.site";

// 검색 결과 타입 정의
export interface SearchResult {
  newConcertId: number;
  title: string;
  subTitle: string;
  date: string;
  venueName: string;
  cityName: string;
  posterUrl: string;
  artistId: number;
  artistName: string;
  artistkrName: string;
  imgUrl: string;
  snsUrl: string;
  genre: string;
}

/**
 * 검색 API 호출 함수
 * @param query - 검색어
 * @returns 검색 결과 배열
 */

export const fetchSearchResults = async (query: string) => {
  try {
    console.log("API 호출 시작:", `${API_BASE_URL}/api/search?keyword=${query}`);
    
    const response = await axios.get(`${API_BASE_URL}/api/search`, {
      params: { keyword: query },
    });

    console.log("API 호출 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("검색 결과를 가져오는 중 오류 발생:", error.message);

    if (error.response) {
      console.error("응답 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 데이터:", error.request);
    } else {
      console.error("에러 메시지:", error.message);
    }

    throw new Error("검색 결과를 가져오는 데 실패했습니다.");
  }
};