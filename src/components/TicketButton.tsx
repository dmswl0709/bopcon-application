import React from "react";
import { Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";

interface TicketButtonProps {
  ticketUrl: string;
}

const TicketButton: React.FC<TicketButtonProps> = ({ ticketUrl }) => {
  const handlePress = () => {
    Linking.openURL(ticketUrl).catch(() =>
      Alert.alert("오류", "티켓 구매 링크를 열 수 없습니다.")
    );
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.ticketText}>예매하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ticketText: {
    fontSize: 14, // 다른 텍스트와 동일한 크기
    color: "blue", // 파란색으로 강조
    textDecorationLine: "underline", // 클릭 가능한 느낌을 위해 밑줄 추가
  },
});

export default TicketButton;