import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import ButtonGroup from "../components/ButtonGroup";
import FavoriteButton from "../components/FavoriteButton";
import SetlistItem from "../components/SetlistItem";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import { fetchConcertData, fetchPredictedSetlist } from "../apis/concerts";
import SampleImage from "../assets/images/sampleimg2.png";
import TicketButton from "../components/TicketButton";

type ConcertScreenProps = StackScreenProps<AppNavigationParamList, "ConcertScreen">;

const ConcertScreen: React.FC<ConcertScreenProps> = ({ route, navigation }) => {
  const { concertId, concertDetails }= route.params || {};
  const [concertData, setConcertData] = useState<any>(null);
  const [predictedSetlist, setPredictedSetlist] = useState<{ order: number; songTitle: string }[]>([]);
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {
    console.log("Received concertId:", concertId); // 전달된 ID 확인
    console.log("Received concertDetails:", concertDetails);
  }, [concertId, concertDetails]);


  useEffect(() => {
    const loadConcertData = async () => {
      try {
        if (!concertId) {
          console.error("Concert ID is missing in route params:", route.params);
          throw new Error("Concert ID가 전달되지 않았습니다.");
        }

        const concert = await fetchConcertData(concertId);
        setConcertData(concert);

        if (concert.artistId) {
          const setlist = await fetchPredictedSetlist(concert.newConcertId);
          setPredictedSetlist(setlist);
        }
      } catch (error: any) {
        console.error("Error fetching concert data:", error.message);
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
      artistId: concertData?.artistId || "unknown",
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
      <ScrollView
            contentContainerStyle={{
              paddingBottom: 16,
              flexGrow: 1,
              justifyContent: "flex-start",
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={false}
          >
        <View style={styles.imageContainer}>
          <Image
            source={
              concertData.posterUrl
                ? { uri: concertData.posterUrl }
                : SampleImage
            }
            style={styles.image}
          />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{concertData.title}</Text>
            <Text style={styles.subTitle}>{concertData.subTitle}</Text>
          </View>
          <FavoriteButton
              id={concertId}
              type="concert"
              newConcertId={concertData?.newConcertId || null} // newConcertId 전달
              artistId={concertData?.artistId || null} // artistId 전달
            />
          </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공연 일정</Text>
            <Text style={styles.infoValue}>
              {formatDateRange(concertData.startDate, concertData.endDate)}
            </Text>
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

        <Text style={styles.setlistTitle}>예상 셋리스트</Text>
        <View style={styles.divider} />
        {predictedSetlist.length > 0 ? (
          predictedSetlist.map((song, index) => (
            <SetlistItem
              key={`predicted-setlist-item-${index}`}
              index={song.order}
              songTitle={song.songTitle}
              ytLink={song.ytLink || null}
              hideIcon={true} // 아이콘 숨기기
            />
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