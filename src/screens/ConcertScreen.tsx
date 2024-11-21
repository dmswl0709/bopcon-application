import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import ButtonGroup from "../components/ButtonGroup";
import FavoriteButton from "../components/FavoriteButton";
import SetlistItem from "../components/SetlistItem"; // SetlistItem 컴포넌트 가져오기
import AppNavigationParamList from "../navigation/AppNavigatorParamList";

type ConcertScreenProps = StackScreenProps<AppNavigationParamList, "ConcertScreen">;

const ConcertScreen: React.FC<ConcertScreenProps> = ({ route, navigation }) => {
  // 콘서트 정보가 없을 경우 기본값 제공
  const { concertDetails: concert = {} } = route.params || {};

  // 임시 데이터 추가
  const defaultConcert = {
    title: "임시 콘서트 제목",
    details: "이 콘서트에 대한 자세한 정보가 없습니다.",
    date: "2024/01/01",
    location: "알 수 없는 장소",
    ticket: "정보 없음",
    image: require("../assets/images/sampleimg2.png"), // 임시 이미지
    singer: "알 수 없는 아티스트",
    setlist: [
      "임시 곡 1",
      "임시 곡 2",
      "임시 곡 3",
      "임시 곡 4",
      "임시 곡 5",
    ],
  };

  // `concert`가 비어있을 경우 `defaultConcert`를 사용
  const concertData = {
    ...defaultConcert,
    ...concert, // 전달된 데이터가 있으면 덮어씌움
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleArtistInfoPress = () => {
    navigation.navigate("ArtistScreen", {
      artistName: concertData.singer || "Unknown Artist",
    });
  };

  const handlePastSetlistPress = () => {
    navigation.navigate("PastSetListScreen", {
      artistName: concertData.singer || "Unknown Artist",
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Concert" onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* 이미지 표시 */}
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof concertData.image === "string"
                ? { uri: concertData.image }
                : concertData.image
            }
            style={styles.image}
          />
        </View>

        {/* 타이틀과 즐겨찾기 버튼 */}
        <View style={styles.titleRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{concertData.title}</Text>
            <Text style={styles.details}>{concertData.details}</Text>
          </View>
          <FavoriteButton />
        </View>

        {/* 공연 정보 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연 일정</Text>
            <Text style={styles.infoValue}>{concertData.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연 장소</Text>
            <Text style={styles.infoValue}>{concertData.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>티켓 예매</Text>
            <Text style={styles.infoValue}>{concertData.ticket}</Text>
          </View>
        </View>

        <ButtonGroup
          onArtistInfoPress={handleArtistInfoPress}
          onPastSetlistPress={handlePastSetlistPress}
        />

        <Text style={styles.setlistTitle}>예상 셋리스트</Text>
        <View style={styles.divider} />

        {/* 셋리스트 */}
        {concertData.setlist && concertData.setlist.length > 0 ? (
          concertData.setlist.map((song: string, index: number) => (
            <SetlistItem key={index} index={index + 1} songName={song} />
          ))
        ) : (
          <Text style={styles.noSetlist}>셋리스트 정보 없음</Text>
        )}
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
    width: "70%",
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
    marginLeft: 23,
    marginRight: 25,
  },
  textContainer: {
    flex: 1, // 텍스트가 버튼과 동일한 공간 차지
  },
  title: {
    fontSize: 20,
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
    marginVertical: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "black",
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
    marginLeft: -7,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
  setlistTitle: {
    fontSize: 18,
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
    marginHorizontal: 16,
    marginTop: 30,
  },
  divider: {
    borderBottomColor: '#D3D3D3', // 연회색 경계선
    borderBottomWidth: 1,
    width: '92%', // 선의 길이를 조정
    alignSelf: 'center', // 중앙 정렬
    marginVertical: 15,
  },
  noSetlist: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginVertical: 16,
    fontFamily: "Pretendard-Regular",
  },
});

export default ConcertScreen;