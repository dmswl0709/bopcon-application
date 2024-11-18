import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SetlistItemProps {
  index: number;
  songName: string;
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.index}>{index < 10 ? `0${index}` : index}</Text>
      <Text style={styles.songName}>{songName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    width: 40, // 번호를 정렬하기 위해 고정된 폭
  },
  songName: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "black",
  },
});

export default SetlistItem;
