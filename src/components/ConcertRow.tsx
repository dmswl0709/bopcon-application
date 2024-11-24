import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface ConcertRowProps {
  dateYear: string;
  dateDay: string;
  description: string;
  onPress: () => void;
}

const ConcertRow: React.FC<ConcertRowProps> = ({
  dateYear,
  dateDay,
  description,
  onPress,
}) => {
  return (
    <View style={styles.concertRow}>
      <View style={styles.dateBox}>
        <Text style={styles.dateYear}>{dateYear}</Text>
        <Text style={styles.dateDay}>{dateDay}</Text>
      </View>
      <Text style={styles.concertDescription}>{description}</Text>
      <TouchableOpacity onPress={onPress}>
        <Image source={require("../assets/icons/next.png")}
          style={styles.nextIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  concertRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateBox: {
    backgroundColor: "black",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 2,
  },
  dateYear: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Pretendard-Regular",
  },
  dateDay: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold",
  },
  concertDescription: {
    flex: 1,
    fontSize: 14,
    color: "black",
    marginLeft: 16,
    fontFamily: "Pretendard-Bold",
  },
  nextIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "gray",
  },
});

export default ConcertRow;