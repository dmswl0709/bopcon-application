import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";

const PastSetListScreen = ({ route, navigation }) => {
  const { artistName } = route.params; // 아티스트 이름 전달 받음

  const pastConcerts = [
    {
      date: "2024.10.26",
      location: "Oklahoma City, OK, USA",
      description: "Benson Boone at Austin City Limits 2024",
    },
    {
      date: "2024.10.26",
      location: "도시, 국가",
      description: "콘서트 제목",
    },
    {
      date: "2024.10.26",
      location: "도시, 국가",
      description: "콘서트 제목",
    },
    {
      date: "2023.09.15",
      location: "London, UK",
      description: "Benson Boone at O2 Arena",
    },
    {
      date: "2023.07.20",
      location: "Paris, France",
      description: "Summer Music Festival Performance",
    },
    {
      date: "2022.12.31",
      location: "New York, USA",
      description: "New Year Countdown Concert",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트 */}
      <Header title="Past Setlist" onBackPress={() => navigation.goBack()} />

      {/* Sampleimg4 이미지 추가 */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/sampleimg4.png")}
          style={styles.topImage}
        />
      </View>

      {/* 아티스트 이름과 FavoriteButton */}
      <View style={styles.artistRow}>
        <View>
          <Text style={styles.artistName}>{artistName}</Text>
          <Text style={styles.artistDetail}>
            This is a brief artist detail or bio.
          </Text>
        </View>
        <FavoriteButton />
      </View>

      {/* 지난 공연 타이틀 */}
      <Text style={styles.pastConcertTitle}>지난 공연</Text>

      {/* divider 추가 */}
      <View style={styles.divider} />

      {/* 지난 공연 리스트 */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {pastConcerts.map((concert, index) => (
          <View key={index} style={styles.concertItem}>
            {/* 검정 배경 날짜 박스 */}
            <View style={styles.dateBox}>
              <Text style={styles.dateYear}>{concert.date.split(".")[0]}</Text>
              <Text style={styles.dateDay}>
                {concert.date.split(".")[1]}/{concert.date.split(".")[2]}
              </Text>
            </View>

            {/* 공연 정보 */}
            <View style={styles.concertInfo}>
              <Text style={styles.concertLocation}>{concert.location}</Text>
              <Text style={styles.concertDescription}>{concert.description}</Text>
            </View>

            {/* Next 버튼 아이콘 */}
            <Image
              source={require("../assets/icons/next.png")}
              style={styles.nextIcon}
            />
          </View>
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
      alignItems: "center", // 센터 정렬
      marginVertical: 16,
    },
    topImage: {
      width: "80%", // 화면 너비의 80%로 줄임
      height: undefined, // 높이는 비율에 맞게 자동 조정
      aspectRatio: 16 / 9, // 원본 비율 유지 (16:9)
      resizeMode: "contain", // 이미지 자르지 않음
    },
    artistRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // 아티스트 이름과 FavoriteButton 양 끝 배치
      paddingHorizontal: 16,
      marginVertical: 16,
    },
    artistName: {
      fontSize: 22,
      fontWeight: "bold",
      fontFamily: "Pretendard-Bold", // Pretendard-Bold 적용
    },
    artistDetail: {
      fontSize: 12,
      color: "gray",
      fontFamily: "Pretendard-Regular",
      marginTop: 4, // Singer 아래에 간격 추가
    },
    divider: {
      borderBottomWidth: 2, // 굵은 경계선
      borderBottomColor: "black", // 경계선 색상
      marginHorizontal: 20,
      marginVertical: 8, // 위아래 공간 추가
    },
    pastConcertTitle: {
      fontSize: 17,
      fontWeight: "bold",
      fontFamily: "Pretendard-Bold", // Pretendard-Bold 적용
      marginHorizontal: 16,
      marginVertical: 8,
    },
    scrollView: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    concertItem: {
      flexDirection: "row", // 날짜 박스, 정보, Next 버튼 수평 배치
      alignItems: "center",
      marginBottom: 2, // 간격을 좁힘
      marginLeft: -12,
      backgroundColor: "white", // 배경색을 화이트로 변경
      borderRadius: 8,
      padding: 16,
      overflow: "hidden",
    },
    dateBox: {
      backgroundColor: "black",
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
      borderRadius: 1,
    },
    dateYear: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: "Pretendard-Regular",
    },
    dateDay: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "Pretendard-Bold",
    },
    concertInfo: {
      flex: 1,
      marginLeft: 16,
    },
    concertLocation: {
      fontSize: 14,
      color: "black",
      fontFamily: "Pretendard-Bold",
      marginBottom: 4,
    },
    concertDescription: {
      fontSize: 11,
      color: "gray",
      fontFamily: "Pretendard-Regular",
    },
    nextIcon: {
      width: 35, // 크기 줄임
      height: 35, // 크기 줄임
      marginRight: -18,
      resizeMode: "contain",
      tintColor: "gray",
    },
  });
  
export default PastSetListScreen;