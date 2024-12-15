import React from "react";
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
  const favorites = useSelector((state: RootState) => state.favorites);

  const isFavorite = type === "artist"
    ? favorites.artists.some((fav) => fav.id === id)
    : favorites.concerts.some((fav) => fav.id === id);

  const handleToggleFavorite = async () => {
    try {
      console.log("좋아요 요청 시작", { id, type, artistId, newConcertId });

      await dispatch(
        toggleFavoriteOnServer({ id, type, artistId, newConcertId })
      ).unwrap();

      Alert.alert(
        "성공",
        isFavorite ? "즐겨찾기에서 제거되었습니다." : "즐겨찾기에 추가되었습니다."
      );
    } catch (error: any) {
      console.error("좋아요 요청 오류:", error.message || error);
      Alert.alert("오류", "즐겨찾기 요청 중 문제가 발생했습니다.");
    }
  };

  return (
    <TouchableOpacity onPress={handleToggleFavorite} style={styles.button}>
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