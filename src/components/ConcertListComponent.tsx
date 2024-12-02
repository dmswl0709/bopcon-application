import React, { memo } from "react";
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

interface Concert {
  id: string;
  posterUrl?: string | number; // URL 또는 로컬 리소스
  title: string;
  date: string;
  venueName: string;
  cityName: string;
  countryName?: string;
}

interface ConcertListComponentProps {
  concerts: Concert[];
  onConcertPress: (concert: Concert) => void;
  horizontal?: boolean; // 수평 또는 수직 설정
}

const ConcertListComponent: React.FC<ConcertListComponentProps> = ({
  concerts,
  onConcertPress,
  horizontal = false,
}) => {
  if (!concerts || concerts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>콘서트 데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={concerts}
      keyExtractor={(item, index) => `concert-${item.id}-${index}`} // 고유한 key 설정
      key={`${horizontal}-${horizontal ? 1 : 2}`} // key 변경으로 재렌더링 강제
      horizontal={horizontal} // 수평 스크롤 활성화 여부
      numColumns={horizontal ? 1 : 2} // 수평이면 1, 수직이면 2개씩
      columnWrapperStyle={!horizontal && styles.row} // 열 스타일
      showsHorizontalScrollIndicator={horizontal}
      showsVerticalScrollIndicator={!horizontal}
      renderItem={({ item }) => (
        <TouchableOpacity style={[styles.concertItem, horizontal && styles.horizontalItem]} onPress={() => onConcertPress(item)}>
          <Image
            source={
              item.posterUrl
                ? typeof item.posterUrl === "string"
                  ? { uri: item.posterUrl } // 외부 URL
                  : item.posterUrl // 로컬 리소스
                : require("../assets/images/sampleimg1.jpg") // 기본 이미지
            }
            style={[styles.posterImage, horizontal && styles.horizontalImage]}
            resizeMode="cover"
          />
          <View style={styles.concertInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.venue}>{`${item.venueName}, ${item.cityName}`}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const screenWidth = Dimensions.get("window").width;
const itemMargin = 36; // 아이템 간 여백
const itemWidth = (screenWidth - itemMargin * 3) / 2; // 두 열 기준 너비 계산

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  row: {
    justifyContent: "space-between", // 각 아이템 간격 조정
    marginBottom: 16, // 열 간 여백
  },
  concertItem: {
    marginHorizontal: itemMargin / 2, // 기본 아이템 여백
    width: itemWidth, // 수직 배치에서 너비
    alignItems: "center",
  },
  horizontalItem: {
    width: 120, // 수평 배치에서 너비
  },
  posterImage: {
    width: "100%", // 부모 요소에 맞게 너비
    height: itemWidth * 1.5, // 비율에 맞는 높이 설정 (2:3 비율)
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  horizontalImage: {
    height: 180, // 수평 배치에서 고정 높이
  },
  concertInfo: {
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  venue: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
  },
});

export default memo(ConcertListComponent);
