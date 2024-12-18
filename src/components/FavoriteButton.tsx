import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleFavoriteOnServer } from "../store/slices/favoritesSlice";
import { checkArtistFavorite, checkConcertFavorite } from "../apis/favorites.api";

interface FavoriteButtonProps {
  id: number; // ID (artistId or concertId)
  type: "artist" | "concert"; // 타입 (아티스트 또는 콘서트)
  artistId?: number | null; // 아티스트 ID (옵션)
  newConcertId?: number | null; // 콘서트 ID (옵션)
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, type, artistId, newConcertId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token); // 인증 토큰
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // 좋아요 상태

  // 서버에서 좋아요 상태 확인
  const fetchFavoriteStatus = async () => {
    if (!token) return;

    try {
      if (type === "artist" && artistId) {
        const response = await checkArtistFavorite({ artistId, token });
        setIsFavorite(response.favorite); // 서버 응답으로 상태 설정
      } else if (type === "concert" && newConcertId) {
        const response = await checkConcertFavorite({ concertId: newConcertId, token });
        setIsFavorite(response.favorite);
      }
    } catch (error) {
      // console.error("Error fetching favorite status:", error.message);
    }
  };

  useEffect(() => {
    fetchFavoriteStatus();
  }, [token, artistId, newConcertId]);

  const handleToggleFavorite = async () => {
    if (isLoading || !token) return;
    setIsLoading(true);

    try {
      await dispatch(
        toggleFavoriteOnServer({
          id,
          type,
          artistId,
          newConcertId,
          isFavorite,
        })
      ).unwrap();

      setIsFavorite((prev) => !prev); // 상태 반전
      Alert.alert("성공", isFavorite ? "즐겨찾기에서 제거되었습니다." : "즐겨찾기에 추가되었습니다.");
    } catch (error: any) {
      console.error("좋아요 토글 오류:", error.message || error);
      Alert.alert("오류", "즐겨찾기 요청 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavorite}
      style={styles.button}
      disabled={isLoading}
    >
      <Image
        source={
          isFavorite
            ? require("../assets/icons/heart-filled.png")
            : require("../assets/icons/heart-outline.png")
        }
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default FavoriteButton;