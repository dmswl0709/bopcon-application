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
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // 구분선 추가
  },
  index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    width: 40, // 번호를 정렬하기 위해 고정된 폭
    textAlign: "center", // 번호를 가운데 정렬
  },
  songName: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "black",
    flex: 1, // 텍스트가 자동으로 공간을 차지하도록 설정
  },
});

export default SetlistItem;