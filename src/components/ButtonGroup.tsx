import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonGroupProps = {
  onArtistInfoPress: () => void;
  onPastSetlistPress: () => void;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onArtistInfoPress,
  onPastSetlistPress,
}) => {
  return (
    <View style={styles.buttonContainer}>
      {/* 아티스트 정보 버튼 */}
      <TouchableOpacity style={[styles.button, styles.artistButton]} onPress={onArtistInfoPress}>
        <Text style={[styles.buttonText, styles.artistButtonText]}>아티스트 정보</Text>
      </TouchableOpacity>

      {/* 지난 공연 셋리스트 버튼 */}
      <TouchableOpacity style={[styles.button, styles.setlistButton]} onPress={onPastSetlistPress}>
        <Text style={[styles.buttonText, styles.setlistButtonText]}>지난 공연 셋리스트</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  artistButton: {
    backgroundColor: "black", // 검은 배경
  },
  setlistButton: {
    backgroundColor: "white", // 흰 배경
    borderWidth: 1,
    borderColor: "black", // 검은 테두리
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "Pretendard-Regular", // 폰트 적용
  },
  artistButtonText: {
    color: "white", // 흰 텍스트
  },
  setlistButtonText: {
    color: "black", // 검은 텍스트
  },
});

export default ButtonGroup;
