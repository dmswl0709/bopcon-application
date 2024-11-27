import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import ButtonGroup from "../components/ButtonGroup";
import FavoriteButton from "../components/FavoriteButton";
import SetlistItem from "../components/SetlistItem";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import { fetchConcertData, fetchPredictedSetlist } from "../apis/concerts"; // concerts.ts에서 가져옴
import SampleImage from "../assets/images/sampleimg2.png"; // 기본 이미지 추가
import TicketButton from "../components/TicketButton";

type ConcertScreenProps = StackScreenProps<AppNavigationParamList, "ConcertScreen">;

const ConcertScreen: React.FC<ConcertScreenProps> = ({ route, navigation }) => {
  const { concertId } = route.params || {};
  const [concertData, setConcertData] = useState<any>(null);
  const [predictedSetlist, setPredictedSetlist] = useState<{ order: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConcertData = async () => {
      try {
        if (!concertId) throw new Error("Concert ID가 전달되지 않았습니다.");
        const concert = await fetchConcertData(concertId);
        setConcertData(concert);

        if (concert.artistId) {
          const setlist = await fetchPredictedSetlist(concert.artistId);
          setPredictedSetlist(setlist);
        }
      } catch (error: any) {
        console.error("ConcertScreen에서 데이터를 불러오는 중 오류 발생:", error.message);
        Alert.alert("오류", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadConcertData();
  }, [concertId]);

  const handleBackPress = () => navigation.goBack();

  const handleArtistInfoPress = () => {
    navigation.navigate("ArtistScreen", {
      artistId: concertData?.artistId || "unknown",
      artistName: concertData?.title || "알 수 없는 아티스트",
      artistDetail: concertData?.subTitle || "알 수 없는 아티스트",
    });
  };

  const handlePastSetlistPress = () => {
    navigation.navigate("PastSetListScreen", {
      artistName: concertData?.title || "Unknown Artist",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!concertData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>콘서트 데이터를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Concert" onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={
              concertData.posterUrl
                ? { uri: concertData.posterUrl } // API에서 받은 URL 이미지
                : SampleImage // 기본 이미지
            }
            style={styles.image}
          />
        </View>

        {/* 제목과 즐겨찾기 */}
        <View style={styles.titleRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{concertData.title}</Text>
            <Text style={styles.subTitle}>{concertData.subTitle}</Text>
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
            <Text style={styles.infoValue}>{`${concertData.venueName}, ${concertData.cityName}, ${concertData.countryName}`}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>티켓 예매</Text>
            <TicketButton ticketUrl={concertData.ticketUrl} />
          </View>
        </View>

        <ButtonGroup
          onArtistInfoPress={handleArtistInfoPress}
          onPastSetlistPress={handlePastSetlistPress}
        />

        {/* 예상 셋리스트 */}
        <Text style={styles.setlistTitle}>예상 셋리스트</Text>
        <View style={styles.divider} />
        {predictedSetlist.length > 0 ? (
          predictedSetlist.map((song, index) => (
            <SetlistItem key={`predicted-setlist-item-${index}`} index={song.order} songName={song.title} />
          ))
        ) : (
          <Text style={styles.noSetlist}>예상 셋리스트 정보 없음</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: "75%",
    height: undefined,
    aspectRatio: 3 / 4,
    resizeMode: "contain",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 11,
    color: "gray",
    fontFamily: "Pretendard-Regular",
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
    fontFamily: "Pretendard-Regular",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
  setlistTitle: {
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
    marginHorizontal: 16,
    marginTop: 30,
  },
  divider: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    width: "92%",
    alignSelf: "center",
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