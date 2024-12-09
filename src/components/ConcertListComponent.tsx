import React, { memo } from "react";
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

interface Concert {
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

const ConcertListComponent = ({ concerts, onConcertPress, horizontal = false }) => {
  if (!concerts || concerts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>콘서트 데이터가 없습니다.</Text>
      </View>
    );
  }

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
      data={concerts}
      keyExtractor={(item, index) => `concert-${item.id}-${index}`}
      horizontal={horizontal}
      numColumns={horizontal ? 1 : 2}
      columnWrapperStyle={!horizontal && styles.row}
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
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.artistName}>{item.artistName}</Text>
            <Text style={styles.date}>{formatDateRange(item.startDate, item.endDate)}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const screenWidth = Dimensions.get("window").width;
const itemMargin = 36;
const itemWidth = (screenWidth - itemMargin * 3) / 2;

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
    marginHorizontal: itemMargin / 2,
    width: itemWidth,
    alignItems: "center",
  },
  horizontalItem: {
    width: 120,
  },
  posterImage: {
    width: "100%",
    height: itemWidth * 1.5,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  horizontalImage: {
    height: 180,
  },
  concertInfo: {
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // 텍스트 왼쪽 정렬
    alignSelf: "flex-start", // 부모 View 기준으로 왼쪽 정렬
  },
  artistName: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    textAlign: "left", // 텍스트 왼쪽 정렬
    alignSelf: "flex-start", // 부모 View 기준으로 왼쪽 정렬
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "left", // 텍스트 왼쪽 정렬
    alignSelf: "flex-start", // 부모 View 기준으로 왼쪽 정렬
  },
});

export default memo(ConcertListComponent);