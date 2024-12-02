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

  // 아티스트 정보 가져오기
  const fetchArtistInfo = async () => {
    try {
      const response = await axios.get<Artist>(`${API_BASE_URL}/api/artists/${artistId}`);
      console.log("아티스트 API 응답:", response.data);

      const imgUrl = response.data.imgUrl.startsWith("http")
        ? response.data.imgUrl
        : `${API_BASE_URL}/${response.data.imgUrl}`;
      setArtist({ ...response.data, imgUrl });
      return response.data.name;
    } catch (error) {
      console.error("아티스트 정보를 불러오는 데 실패:", error.message);
      Alert.alert("오류", "아티스트 정보를 불러오는 데 실패했습니다.");
      return null;
    }
  };

  const fetchPastConcerts = async (artistName: string | null) => {
    if (!artistName) return;

    try {
      const response = await axios.get<PastConcert[]>(
        `${API_BASE_URL}/api/past-concerts/artist/${encodeURIComponent(artistName)}`
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
    const artistName = await fetchArtistInfo();
    if (artistName) {
      await fetchPastConcerts(artistName);
    }
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
        <Image source={{ uri: artist.imgUrl }} style={styles.artistImage} />
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
        {pastConcerts.map((concert) => (
          <ConcertRow
            key={concert.pastConcertId}
            dateYear={new Date(concert.date).getFullYear().toString()}
            dateDay={`${new Date(concert.date).getMonth() + 1}/${new Date(concert.date).getDate()}`}
            description={`${concert.cityName}, ${concert.countryName || concert.venueName}`}
            // 수정: 콘서트 정보를 SetlistScreen으로 전달
            onPress={() =>
              navigation.navigate("SetListScreen", {
                artistId,
                pastconcertId: concert.pastConcertId,
                title: concert.venueName,
                cityName: concert.cityName,
                venueName: concert.venueName,
              })
            }
          />
        ))}
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
  artistImage: { width: 210, height: 210, marginBottom: 16, resizeMode: "cover" },
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
