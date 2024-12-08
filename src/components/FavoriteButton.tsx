import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { toggleFavorite } from "../store/slices/favoritesSlice"; // Redux 액션 가져오기

interface FavoriteButtonProps {
  id: number; // artistId 또는 concertId 전달
  type: "artist" | "concert"; // 타입 구분 (아티스트/콘서트)
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, type }) => {
  const dispatch = useDispatch();

  // Redux 상태에서 즐겨찾기 여부 확인
  const favorites = useSelector((state: RootState) => state.favorites);

  // 각 아티스트와 콘서트의 favoriteId를 기준으로 하트를 채우거나 비우기
  const isFavorite = type === "artist"
    ? (favorites.artists?.some((artist) => artist.favoriteId === id) || false)
    : (favorites.concerts?.some((concert) => concert.favoriteId === id) || false);

  const handleToggleFavorite = () => {
    // Redux 액션 호출하여 즐겨찾기 상태 변경
    dispatch(toggleFavorite({ id, type }));
  };

  return (
    <TouchableOpacity onPress={handleToggleFavorite} style={styles.button}>
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
    padding: 8, // 터치 영역 확장
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain", // 이미지 크기 유지
  },
});

export default FavoriteButton;