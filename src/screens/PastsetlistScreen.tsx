import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Header from "../components/Header";
import ConcertRow from "../components/ConcertRow";
import FavoriteButton from "../components/FavoriteButton";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";

type PastSetlistScreenRouteProp = RouteProp<AppNavigatorParamList, "PastSetlistScreen">;

interface Artist {
  artist_id: number;
  name: string; // 아티스트 이름
  imgUrl: string; // 아티스트 이미지 URL
  krName?: string; // 아티스트 한글 이름 (선택적)
}

interface PastConcert {
  pastConcertId: number;
  venueName: string;
  cityName: string;
  countryName: string;
  date: string;
}

const API_BASE_URL = "http://localhost:8080"; // 개발 환경 URL

const PastSetlistScreen: React.FC = () => {
  const route = useRoute<PastSetlistScreenRouteProp>();
  const { artistId } = route.params;
  const navigation = useNavigation();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [pastConcerts, setPastConcerts] = useState<PastConcert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtistInfo = async () => {
    try {
      const response = await axios.get<Artist>(`${API_BASE_URL}/api/artists/${artistId}`);
      console.log("아티스트 API 응답:", response.data);

      const imgUrl = response.data.imgUrl.startsWith("http")
        ? response.data.imgUrl
        : `${API_BASE_URL}/${response.data.imgUrl}`;
      setArtist({ ...response.data, imgUrl });
    } catch (error) {
      console.error("아티스트 정보를 불러오는 데 실패:", error.message);
      Alert.alert("오류", "아티스트 정보를 불러오는 데 실패했습니다.");
    }
  };

  const fetchPastConcerts = async () => {
    try {
      const response = await axios.get<PastConcert[]>(
        `${API_BASE_URL}/api/artists/${artistId}/past-concerts`
      );
      console.log("Past Concerts API 응답:", response.data);
      setPastConcerts(response.data);
    } catch (error) {
      console.error("과거 콘서트 정보를 불러오는 데 실패:", error.message);
      Alert.alert("오류", "과거 콘서트 정보를 불러오는 데 실패했습니다.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchArtistInfo();
    await fetchPastConcerts();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [artistId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>아티스트 정보를 불러오는 데 실패했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Past Setlist" />
      <View style={styles.artistContainer}>
        <Image 
          source={{ uri: artist.imgUrl }} 
          style={styles.artistImage} 
          resizeMode="contain"
        />
        <View style={styles.artistInfoRow}>
          <View style={styles.artistTextContainer}>
            <Text style={styles.artistName}>{artist.name}</Text>
            {artist.krName && <Text style={styles.artistKrName}>{artist.krName}</Text>}
          </View>
          <FavoriteButton style={styles.favoriteButton} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>지난 공연</Text>
      <View style={styles.divider} />
      <ScrollView contentContainerStyle={styles.concertList}>
        {pastConcerts.map((concert) => {
          let dateYear = "N/A";
          let dateDay = "N/A";

          if (Array.isArray(concert.date) && concert.date.length === 3) {
            // 배열로 전달된 경우 처리
            const [year, month, day] = concert.date;
            const concertDate = new Date(year, month - 1, day);

            // 날짜가 유효한지 확인
            if (!isNaN(concertDate.getTime())) {
              dateYear = concertDate.getFullYear().toString();
              dateDay = `${concertDate.getMonth() + 1}/${concertDate.getDate()}`;
            } else {
              console.warn("Invalid date format:", concert.date);
            }
          } else {
            console.warn("Empty or unexpected date format:", concert.date);
          }

          return (
            <ConcertRow
              key={concert.pastConcertId}
              dateYear={dateYear}
              dateDay={dateDay}
              description={`${concert.cityName}, ${concert.countryName || concert.venueName}`}
              onPress={() =>
                navigation.navigate("SetListScreen", {
                  artistId,
                  date: concert.date, // 날짜 전달
                  pastConcertId: concert.pastConcertId, // ID 전달
                  title: concert.venueName,
                  cityName: concert.cityName,
                  venueName: concert.venueName,
                })
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
  artistContainer: { alignItems: "center", padding: 16 },
  artistImage: {
    width: "82%",
    height: undefined, 
    aspectRatio: 1,
    marginBottom: 5,
  },
  artistInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  artistTextContainer: { flex: 1 },
  artistName: { fontSize: 20, fontWeight: "bold" },
  artistKrName: { fontSize: 16, color: "gray" },
  favoriteButton: { marginRight: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginHorizontal: 16, marginBottom: 8 },
  divider: { height: 2, backgroundColor: "black", marginHorizontal: 16, marginBottom: 16 },
  concertList: { paddingHorizontal: 16 },
});

export default PastSetlistScreen;