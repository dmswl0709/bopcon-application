import React, { memo } from "react";
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

interface Concert {
  newConcertId: number;
  id: string;
  posterUrl?: string | number;
  title: string;
  artistName: string;
  startDate: string;
  endDate: string;
  venueName: string;
  cityName: string;
  countryName?: string;
}

interface ConcertListComponentProps {
  concerts: Concert[];
  onConcertPress: (concert: Concert) => void;
  horizontal?: boolean;
}

const ConcertListComponent = ({ concerts, onConcertPress, horizontal = false }: ConcertListComponentProps) => {
  if (!concerts || concerts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>콘서트 데이터가 없습니다.</Text>
      </View>
    );
  }

  // `newConcertId` 기준으로 내림차순 정렬
  const sortedConcerts = [...concerts].sort((a, b) => b.newConcertId - a.newConcertId);

  const formatDateRange = (startDate, endDate) => {
    const formatArrayToDate = (dateArray) => {
      if (!Array.isArray(dateArray)) return "";
      const [year, month, day] = dateArray;
      return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
    };

    const formattedStartDate = formatArrayToDate(startDate);
    const formattedEndDate = formatArrayToDate(endDate);

    if (formattedStartDate === formattedEndDate) {
      return formattedStartDate; // 동일한 날짜일 경우
    }

    return `${formattedStartDate} ~ ${formattedEndDate}`; // 다른 날짜일 경우
  };

  return (
    <FlatList
      data={sortedConcerts} // 정렬된 데이터를 전달
      keyExtractor={(item, index) => `concert-${item.id}-${index}`}
      horizontal={horizontal}
      numColumns={horizontal ? 1 : 2}
      columnWrapperStyle={!horizontal && styles.row}
      showsHorizontalScrollIndicator={false} // 스크롤 바 숨김
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.concertItem, horizontal && styles.horizontalItem]}
          onPress={() => onConcertPress(item)}
        >
          <Image
            source={
              item.posterUrl
                ? typeof item.posterUrl === "string"
                  ? { uri: item.posterUrl }
                  : item.posterUrl
                : require("../assets/images/sampleimg1.jpg")
            }
            style={[styles.posterImage, horizontal && styles.horizontalImage]}
            resizeMode="cover"
          />
          <View style={styles.concertInfo}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.artistName}>{item.artistName}</Text>
            <Text style={styles.date}>{formatDateRange(item.startDate, item.endDate)}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const screenWidth = Dimensions.get("window").width;
const desiredVisibleItems = 2.4; // 화면에 보이는 아이템 개수
const itemMargin = 10; // 아이템 간의 여백
const itemWidth = (screenWidth - itemMargin * (desiredVisibleItems + 1)) / desiredVisibleItems;


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
    justifyContent: "space-between",
    marginBottom: 16,
  },
  concertItem: {
    marginHorizontal: itemMargin / 1, // 아이템 간의 간격 조정
    width: Math.max(itemWidth, 120), // 최소 너비 보장
    alignItems: "flex-start", // 텍스트 정렬
  },
  posterImage: {
    width: "100%",
    height: Math.max(itemWidth * 1.5, 180), // 최소 높이 보장
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    marginLeft: itemMargin / 2, // "NEW" 선에 맞추기 위해 조정
  },
  horizontalImage: {
    height: Math.max(itemWidth * 1.5, 180), // 높이를 비율에 맞게 조정
  },
  concertInfo: {
    alignItems: "flex-start", // 텍스트 왼쪽 정렬
    width: "100%", // 텍스트 너비를 이미지와 맞춤
    marginLeft: itemMargin / 2, // "NEW" 선과 텍스트 정렬
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    maxWidth: "100%", // 텍스트 너비를 제한
  },
  artistName: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    textAlign: "left",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "left",
  },
});

export default memo(ConcertListComponent);