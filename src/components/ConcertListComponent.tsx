import React, { memo } from "react";
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

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
  horizontal?: boolean;
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
      keyExtractor={(item) => item.id}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.concertItem} onPress={() => onConcertPress(item)}>
          <Image
            source={
              item.posterUrl
                ? typeof item.posterUrl === "string"
                  ? { uri: item.posterUrl } // 외부 URL
                  : item.posterUrl // 로컬 리소스
                : require("../assets/images/sampleimg1.jpg") // 기본 이미지
            }
            style={styles.posterImage}
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
  concertItem: {
    marginHorizontal: 10,
    width: 150,
    alignItems: "center",
  },
  posterImage: {
    width: 120,
    height: 180,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
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