import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import ButtonGroup from "../components/ButtonGroup";
import FavoriteButton from "../components/FavoriteButton"; // FavoriteButton 추가
import AppNavigationParamList from "../navigation/AppNavigatorParamList";

type ConcertScreenProps = StackScreenProps<AppNavigationParamList, "ConcertScreen">;

const ConcertScreen: React.FC<ConcertScreenProps> = ({ route, navigation }) => {
  const { concert } = route.params;

  const handleBackPress = () => {
    console.log("Navigating back...");
    navigation.goBack();
  };

  const handleArtistInfoPress = () => {
    console.log("아티스트 정보 버튼 클릭");
  };

  const handlePastSetlistPress = () => {
    console.log("지난 공연 셋리스트 버튼 클릭");
  };

  return (
    <View style={styles.container}>
      <Header title="Concert" onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* 이미지 표시 */}
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof concert.image === "string"
                ? { uri: concert.image }
                : concert.image || require("../assets/images/sampleimg2.png")
            }
            style={styles.image}
          />
        </View>

        {/* 타이틀과 즐겨찾기 버튼 */}
        <View style={styles.titleRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{concert.title || "콘서트 제목 없음"}</Text>
            <Text style={styles.details}>{concert.details || "세부 정보 없음"}</Text>
          </View>
          <FavoriteButton />
        </View>

        {/* 공연 정보 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연 일정</Text>
            <Text style={styles.infoValue}>{concert.date || "날짜 미정"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연 장소</Text>
            <Text style={styles.infoValue}>{concert.location || "장소 미정"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>티켓 예매</Text>
            <Text style={styles.infoValue}>{concert.ticket || "정보 없음"}</Text>
          </View>
        </View>

        <ButtonGroup
          onArtistInfoPress={handleArtistInfoPress}
          onPastSetlistPress={handlePastSetlistPress}
        />

        <Text style={styles.setlistTitle}>예상 셋리스트</Text>
        {(concert.setlist || ["셋리스트 정보 없음"]).map((song: string, index: number) => (
          <Text key={index} style={styles.setlistItem}>
            {index + 1}. {song}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: "80%",
    height: undefined,
    aspectRatio: 3 / 4,
    resizeMode: "contain",
  },
  titleRow: {
    flexDirection: "row", // 타이틀과 버튼을 수평으로 배치
    alignItems: "center",
    justifyContent: "space-between", // 공간을 양 끝으로 배치
    marginHorizontal: 16,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1, // 텍스트가 버튼과 동일한 공간 차지
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold", // Pretendard-Bold 적용
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "black",
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
  setlistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold", // Pretendard-Bold 적용
    marginHorizontal: 16,
    marginTop: 24,
  },
  setlistItem: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

export default ConcertScreen;
