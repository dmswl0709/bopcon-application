
import axios from "axios";

// API 기본 URL
const API_BASE_URL = "https://api.bopcon.site";

// Concert 데이터 타입 정의
export interface Concert {
  newConcertId: string;
  id: string;
  artistId: string;
  artistName: string;
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
  songTitle: string;
  songId: number;
  ytLink: string | null;
}

// Axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
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
export const fetchPastConcerts = async (artistId: number): Promise<Concert[]> => {
  if (!artistId) {
    console.warn("artistName이 누락되었습니다.");
    return [];
  }
  try {
    console.log(`Fetching past concerts for artistName: ${artistId}`);
    const response = await apiClient.get<Concert[]>(`/api/artists/${artistId}/past-concerts`);
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
        songTitle: item.songTitle, // JSON에 맞는 필드명
        songId: item.songId,
        ytLink: item.ytLink,
      })) || [],
    };
  } catch (error) {
    console.error("Error fetching concert data:", error.message);
    throw new Error("Failed to fetch concert data");
  }
};

export const fetchConcerts = async (): Promise<Concert[]> => {
  try {
    const response = await apiClient.get<Concert[]>("/api/new-concerts");
    // `newConcertId` 포함하여 데이터 매핑
    return response.data.map((concert) => ({
      newConcertId: concert.newConcertId, // 추가된 필드
      id: concert.newConcertId || concert.id || "", // id 매핑
      artistId: concert.artistId,
      title: concert.title,
      artistName: concert.artistName,
      startDate: concert.startDate, // 배열 그대로 유지
      endDate: concert.endDate,   // 배열 그대로 유지
      venueName: concert.venueName,
      cityName: concert.cityName,
      genre: concert.genre,
      posterUrl: concert.posterUrl,
    }));
  } catch (error) {
    console.error("Error fetching concerts:", error.message);
    throw new Error("Failed to fetch concert list");
  }
};

// 예측된 Setlist 가져오기
export const fetchPredictedSetlist = async (newConcertId: string): Promise<Song[]> => {
  if (!newConcertId) {
    console.warn("artistId가 누락되었습니다.");
    return [];
  }
  try {
    console.log(`Fetching predicted setlist for newConcertId: ${newConcertId}`);
    const response = await apiClient.get<Song[]>(`/api/new-concerts/${newConcertId}/predicted-setlist`);
    console.log("Fetched predicted setlist:", response.data);
    return response.data.map((item) => ({
      order: item.order,
      songTitle: item.songTitle,
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

const fetchConcertsByGenre = async () => {
  console.log("Fetching concerts for genre:", name); // 디버깅용 로그 추가
  setLoading(true); // 로딩 시작
  setError(null); // 에러 초기화

  try {
    // API 경로 수정 (명세에 따라 경로 확인)
    const response = await axios.get(`${API_BASE_URL}/api/concerts/genre/${name}`);
    console.log("Fetched concerts:", response.data); // 데이터 디버깅
    setConcerts(response.data); // 데이터를 상태에 저장
  } catch (err: any) {
    console.error("Error fetching concerts:", err.message);
    if (err.response) {
      console.error("API 응답 상태 코드:", err.response.status); // HTTP 상태 코드
      console.error("API 응답 데이터:", err.response.data); // 응답 데이터
    }
    setError("콘서트 데이터를 불러오는 데 실패했습니다.");
  } finally {
    setLoading(false); // 로딩 종료
  }
};

export const fetchUpcomingConcerts = async (artistId: number) => {
  try {
    const response = await axios.get(`http://api.bopcon.site/api/artists/${artistId}/concerts`);
    console.log("Fetched upcoming concerts:", response.data);

    // id가 없는 경우 index를 기반으로 기본 id 생성
    return response.data.map((concert, index) => ({
      ...concert,
      id: concert.id || `generated-id-${index}`, // id가 없는 경우 기본값 추가
    }));
  } catch (error) {
    console.error("Failed to fetch upcoming concerts:", error);
    throw error; // 오류 발생 시 상위에서 처리
  }
};






const getUpcomingConcerts = async () => {
  try {
    const concerts = await fetchUpcomingConcerts(artistId); // concert.ts에서 fetchUpcomingConcerts 호출
    if (Array.isArray(concerts) && concerts.length > 0) {
      setUpcomingConcerts(concerts); // API 데이터 설정
    } else {
      console.warn("No upcoming concerts found, using fallback data");
      setUpcomingConcerts(tempConcertData); // fallback 데이터로 설정
    }
  } catch (error) {
    console.error("Error fetching upcoming concerts:", error);
    setUpcomingConcerts(tempConcertData); // fallback 데이터로 설정
  }
};

// export const fetchSongRanking = async (artistId: string): Promise<Record<string, number>> => {
//   try {
//     if (!artistId) {
//       console.error("Invalid artistId: artistId is missing or null.");
//       throw new Error("artistId가 제공되지 않았습니다.");
//     }

//     const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
//     if (!isValidUUID(artistId)) {
//       console.error("Invalid MBID format:", artistId);
//       throw new Error("Invalid MBID format provided.");
//     }
//     const url = `/api/song-ranking/artist/${artistId}`;
//     console.log("Fetching song ranking data from URL:", url);

//     const response = await apiClient.get<Record<string, number>>(url);
//     console.log("Fetched song ranking data:", response.data);

//     return response.data; // 성공적으로 가져온 데이터 반환
//   } catch (error: any) {
//     console.error("Error fetching song ranking:", error.message);

//     // 상세한 오류 디버깅
//     if (error.response) {
//       console.error("Response status:", error.response.status);
//       console.error("Response data:", error.response.data);
//     }

//     throw new Error("Failed to fetch song ranking data.");
//   }
// };


export const fetchSongRanking = async (artistId) => {
  if (!artistId) {
    throw new Error("mbid is required to fetch song ranking.");
  }

  try {
    const response = await axios.get(`https://api.bopcon.site/api/artists/${artistId}/song-ranking`);
    const topSongs = Object.entries(response.data)
      .sort(([, a], [, b]) => b - a) // 점수 내림차순 정렬
      .slice(0, 10) // 상위 10개 선택
      .map(([song]) => song); // 곡 제목만 반환
    return topSongs;
  } catch (error) {
    console.error("Error fetching song ranking:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchLyrics = async (artistId: string, songTitle: string): Promise<string> => {
  try {
    // API 호출로 과거 콘서트 데이터를 가져옵니다.
    const response = await axios.get(
      `https://api.bopcon.site/api/artists/${artistId}/past-concerts`
    );

    // setlists 배열 내부에서 songTitle과 일치하는 가사 찾기
    let foundLyrics: string | null = null;

    response.data.forEach((concert: any) => {
      if (concert.setlists) {
        const matchedSong = concert.setlists.find(
          (item: any) => item.song?.title === songTitle
        );

        if (matchedSong && matchedSong.song?.lyrics) {
          foundLyrics = matchedSong.song.lyrics;
        }
      }
    });

    return foundLyrics || "가사 정보가 없습니다.";
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return "가사를 불러오는 중 오류가 발생했습니다.";
  }
};

// 예상 가사 불러오기 함수
export const fetchPredictLyrics = async (newConcertId: string, songTitle: string): Promise<string> => {
  if (!newConcertId || !songTitle) {
    throw new Error("newConcertId 또는 songTitle이 없습니다.");
  }

  try {
    const response = await axios.get(
      `https://api.bopcon.site/api/new-concerts/${newConcertId}/predicted-setlist`
    );

    console.log("API Response:", response.data); // 디버깅 로그
    const foundSong = response.data.find((item: any) => item.songTitle === songTitle);
    return foundSong?.lyrics || "가사 정보가 없습니다.";
  } catch (error) {
    console.error("Error fetching predicted lyrics:", error);
    throw new Error("예상 가사를 불러오는 중 오류가 발생했습니다.");
  }
};