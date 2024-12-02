import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080";

// Concert 데이터 타입 정의
export interface Concert {
  newConcertId: string;
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
  setlist?: Song[]; // JSON에 맞게 setlist 타입 수정
}

// Song 데이터 타입 정의
export interface Song {
  order: number;
  title: string;
  songId: number;
  ytLink: string | null;
}

// Axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Artist 이름 가져오기
export const fetchArtistName = async (artistId: string): Promise<string> => {
  if (!artistId) {
    console.warn("artistId가 누락되었습니다.");
    return "";
  }
  try {
    const response = await apiClient.get<{ name: string }>(`/api/artists/${artistId}`);
    console.log("Fetched artist name:", response.data.name);
    return response.data.name;
  } catch (error: any) {
    console.error("Error fetching artist name:", error.message);
    throw new Error("Failed to fetch artist name");
  }
};

// Past Concerts 가져오기
export const fetchPastConcerts = async (artistName: string): Promise<Concert[]> => {
  if (!artistName) {
    console.warn("artistName이 누락되었습니다.");
    return [];
  }
  try {
    console.log(`Fetching past concerts for artistName: ${artistName}`);
    const response = await apiClient.get<Concert[]>(`/api/past-concerts/artist/${artistName}`);
    console.log("Fetched past concerts:", response.data);
    return response.data.map((concert) => ({
      id: concert.id || concert.newConcertId || "",
      artistId: concert.artistId,
      title: concert.title,
      subTitle: concert.subTitle,
      date: concert.date,
      venueName: concert.venueName,
      cityName: concert.cityName,
      countryName: concert.countryName,
      posterUrl: concert.posterUrl || "",
      ticketUrl: concert.ticketUrl,
      concertStatus: concert.concertStatus,
      genre: concert.genre,
      setlist: concert.setlist || [],
    }));
  } catch (error: any) {
    console.error("Error fetching past concerts:", error.message);
    throw new Error("Failed to fetch past concerts");
  }
};

// 단일 Concert 데이터 가져오기
export const fetchConcertData = async (concertId: string): Promise<Concert> => {
  try {
    const response = await apiClient.get<Concert>(`/api/new-concerts/${concertId}`);
    const data = response.data;

    console.log("Fetched concert data:", data); // 응답 데이터 출력
    return {
      ...data,
      id: data.id || data.newConcertId || "", // id 매핑 수정
      setlist: data.setlist?.map((item: any) => ({
        order: item.order,
        title: item.title, // JSON에 맞는 필드명
        songId: item.songId,
        ytLink: item.ytLink,
      })) || [],
    };
  } catch (error) {
    console.error("Error fetching concert data:", error.message);
    throw new Error("Failed to fetch concert data");
  }
};

// 전체 Concert 목록 가져오기
export const fetchConcerts = async (): Promise<Concert[]> => {
  try {
    const response = await apiClient.get<Concert[]>("/api/new-concerts");
    return response.data.map((concert) => ({
      id: concert.id || concert.newConcertId || "", // id 매핑 수정
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
      setlist: concert.setlist || [], // setlist 기본값
    }));
  } catch (error) {
    console.error("Error fetching concerts:", error.message);
    throw new Error("Failed to fetch concert list");
  }
};

// 예측된 Setlist 가져오기
export const fetchPredictedSetlist = async (artistId: string): Promise<Song[]> => {
  if (!artistId) {
    console.warn("artistId가 누락되었습니다.");
    return [];
  }
  try {
    console.log(`Fetching predicted setlist for artistId: ${artistId}`);
    const response = await apiClient.get<Song[]>(`/api/setlists/predict/artist/${artistId}`);
    console.log("Fetched predicted setlist:", response.data);
    return response.data.map((item) => ({
      order: item.order,
      title: item.title,
      songId: item.songId,
      ytLink: item.ytLink,
    }));
  } catch (error: any) {
    console.error("Error fetching predicted setlist:", error.message);
    throw new Error("Failed to fetch predicted setlist");
  }
};

export const fetchPastConcertsByArtistName = async (artistName: string): Promise<Concert[]> => {
  try {
    const url = `/api/past-concerts/artist/${artistName}`;
    console.log("Fetching past concerts from URL:", url);

    const response = await apiClient.get<Concert[]>(url);
    console.log("Fetched past concerts:", response.data);

    return response.data.map((concert) => ({
      id: concert.pastConcertId.toString(),
      venueName: concert.venueName,
      cityName: concert.cityName,
      countryName: concert.countryName || "",
      date: concert.date,
      title: concert.title || "",
      setlist: [],
    }));
  } catch (error) {
    console.error("Error fetching past concerts:", error.message);
    throw new Error("Failed to fetch past concerts");
  }
};

const fetchArtistInfo = async () => {
  try {
    const response = await axios.get<Artist>(`${API_BASE_URL}/api/artists/${artistId}`);

    // 아티스트 데이터 가져오기 및 이미지 URL 확인
    const artistData = {
      ...response.data,
      img_url: response.data.img_url?.startsWith("http")
        ? response.data.img_url
        : `${API_BASE_URL}/${response.data.img_url}` // 상대 경로 -> 절대 경로 변환
    };

    // 이미지 URL 검증
    const isValidImage = await verifyImageUrl(artistData.img_url);
    if (!isValidImage) {
      artistData.img_url = "https://via.placeholder.com/150"; // 기본 이미지 URL 설정
    }

    setArtist(artistData);
    return artistData.name;
  } catch (error) {
    console.error("Error fetching artist info:", error.message);
    Alert.alert("오류", "아티스트 정보를 불러오는 데 실패했습니다.");
    return null;
  }
};

// 이미지 URL 유효성 검사 함수
const verifyImageUrl = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.warn("Invalid image URL:", url);
    return false;
  }
};
