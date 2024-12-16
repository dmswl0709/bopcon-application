import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleFavoriteOnServer } from "../store/slices/favoritesSlice";

interface FavoriteButtonProps {
  id: number; // ID (artistId or concertId)
  type: "artist" | "concert"; // 타입 (아티스트 또는 콘서트)
  artistId?: number | null; // 아티스트 ID (옵션)
  newConcertId?: number | null; // 콘서트 ID (옵션)
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, type, artistId, newConcertId }) => {
  const dispatch = useDispatch();

  // Redux 상태에서 favorites 가져오기
  const favorites = useSelector((state: RootState) => state.favorites);

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // 현재 좋아요 상태 계산 - undefined 방지 (기본값 [])
  const isFavorite = type === "artist"
    ? (favorites.artists || []).some((fav) => fav.id === id) // artists가 없으면 빈 배열
    : (favorites.concerts || []).some((fav) => fav.id === id); // concerts가 없으면 빈 배열

  const handleToggleFavorite = async () => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);

    try {
      console.log("좋아요 요청 시작", { id, type, artistId, newConcertId, isFavorite });

      // 좋아요 추가/삭제 요청 전송
      await dispatch(
        toggleFavoriteOnServer({ id, type, artistId, newConcertId, isFavorite })
      ).unwrap();

      Alert.alert(
        "성공",
        isFavorite ? "즐겨찾기에서 제거되었습니다." : "즐겨찾기에 추가되었습니다."
      );
    } catch (error: any) {
      console.error("좋아요 요청 오류:", error.message || error);
      Alert.alert("오류", "즐겨찾기 요청 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavorite}
      style={styles.button}
      disabled={isLoading} // 로딩 중에는 비활성화
    >
      <Image
        source={
          isFavorite
            ? require("../assets/icons/heart-filled.png") // 채워진 하트
            : require("../assets/icons/heart-outline.png") // 빈 하트
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