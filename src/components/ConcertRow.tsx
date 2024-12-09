import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface ConcertRowProps {
  startDay?: string;
  endDay?: string;
  date?: string; // date 추가
  description: string;
  onPress: () => void;
}

const ConcertRow: React.FC<ConcertRowProps> = ({ date, startDay, endDay, description, onPress }) => {
  // 기본값 설정
  const safeStartDay = startDay || (date ? date.split(" ~ ")[0] : ""); // date에서 시작일 추출
  const safeEndDay = endDay || (date ? date.split(" ~ ")[1] : ""); // date에서 종료일 추출

  // 날짜 분리
  const [startYear, startMonth, startDayOnly] = safeStartDay.split(".");
  const [endYear, endMonth, endDayOnly] = safeEndDay.split(".");
  
  // 연도 단축형
  const shortStartYear = startYear?.slice(2) || "";
  const shortEndYear = endYear?.slice(2) || "";

  console.log("Rendering ConcertRow:", { startDay, endDay, date, description });

  return (
    <View style={styles.concertRow}>
      <View style={styles.dateBox}>
        {safeStartDay === safeEndDay ? (
          // startDay와 endDay가 같을 경우 전체 연도 사용
          <>
            <Text style={styles.dateYear}>{startYear}</Text>
            <Text style={styles.dateDay}>
              {startMonth}.{startDayOnly}
            </Text>
          </>
        ) : (
          // startDay와 endDay가 다를 경우
          <>
            <Text style={styles.dateYear}>
              {shortStartYear} {startMonth}.{startDayOnly}
            </Text>
            <Text style={styles.dateSeparator}>~</Text>
            <Text style={styles.dateYear}>
              {shortEndYear} {endMonth}.{endDayOnly}
            </Text>
          </>
        )}
      </View>
      <Text style={styles.concertDescription}>{description}</Text>
      <TouchableOpacity onPress={onPress}>
        <Image source={require("../assets/icons/next.png")} style={styles.nextIcon} />
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
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  dateYear: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateDay: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateSeparator: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 2,
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