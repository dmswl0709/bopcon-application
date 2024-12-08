import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} style={styles.button}>
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
    padding: 8, // 터치 영역 확대
  },
  icon: {
    width: 24,
    height: 24, // 하트 아이콘 크기
    resizeMode: "contain",
  },
});

export default FavoriteButton;
