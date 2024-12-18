import  httpClient  from './http';

// Favorite 데이터 타입 정의
interface FavoriteResponse {
  favoriteId: number;
  userId: number;
  artistId: number | null;
  concertId: number | null;
}

// 서버에서 반환하는 성공 메시지 타입
interface SuccessResponse {
  message: string;
}

// 아티스트 즐겨찾기 추가
export const addArtistFavorite = async ({
  artistId,
  token,
}: {
  artistId: number;
  token: string;
}): Promise<SuccessResponse> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.post(
      `/api/favorites/artist/${artistId}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error('Error adding artist favorite:', error);
    throw new Error('아티스트 즐겨찾기 추가 요청에 실패했습니다.');
  }
};

// 콘서트 즐겨찾기 추가
export const addConcertFavorite = async ({
  concertId,
  token,
}: {
  concertId: number;
  token: string;
}): Promise<SuccessResponse> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.post(
      `/api/favorites/concert/${concertId}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error('Error adding concert favorite:', error);
    throw new Error('콘서트 즐겨찾기 추가 요청에 실패했습니다.');
  }
};

// 아티스트 즐겨찾기 삭제
export const removeArtistFavorite = async ({
  artistId,
  token,
}: {
  artistId: number;
  token: string;
}): Promise<SuccessResponse> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.delete(
      `/api/favorites/artist/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error('Error removing artist favorite:', error);
    throw new Error('아티스트 즐겨찾기 삭제 요청에 실패했습니다.');
  }
};

// 콘서트 즐겨찾기 삭제
export const removeConcertFavorite = async ({
  concertId,
  token,
}: {
  concertId: number;
  token: string;
}): Promise<SuccessResponse> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.delete(
      `/api/favorites/concert/${concertId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error('Error removing concert favorite:', error);
    throw new Error('콘서트 즐겨찾기 삭제 요청에 실패했습니다.');
  }
};

// 즐겨찾기 목록 조회
export const getUserFavorites = async ({
  token,
}: {
  token: string;
}): Promise<FavoriteResponse[]> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.get('/api/favorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw new Error('즐겨찾기 조회 요청에 실패했습니다.');
  }
};


// 아티스트 즐겨찾기 여부 확인
export const checkArtistFavorite = async ({
  artistId,
  token,
}: {
  artistId: number;
  token: string;
}): Promise<{ favorite: boolean }> => {
  if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

  try {
    const { data } = await httpClient.get(
      `/api/favorites/artist/${artistId}/check`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    // console.error("Error checking artist favorite:", error);
    throw new Error("아티스트 즐겨찾기 확인 요청에 실패했습니다.");
  }
};

export const checkConcertFavorite = async ({
  concertId,
  token,
}: {
  concertId: number;
  token: string;
}): Promise<{ favorite: boolean }> => {
  if (!token) throw new Error('토큰이 없습니다. 로그인이 필요합니다.');

  try {
    const { data } = await httpClient.get(
      `/api/favorites/concert/${concertId}/check`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data; // 서버로부터 { favorite: true/false } 반환
  } catch (error) {
    // console.error('Error checking concert favorite:', error);
    throw new Error('콘서트 즐겨찾기 확인 요청에 실패했습니다.');
  }
};