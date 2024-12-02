import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";
import SetlistItem from "../components/SetlistItem";

const API_BASE_URL = "http://localhost:8080";

const SetListScreen = ({ route, navigation }) => {
  const { artistId, pastconcertId, title, cityName, venueName } = route.params;

  const [concertImage, setConcertImage] = useState("");
  const [setlist, setSetlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch concert image
  const fetchConcertImage = async () => {
    try {
      console.log(`Fetching artist image for artistId: ${artistId}`);
      const response = await axios.get(`${API_BASE_URL}/api/artists/${artistId}`);
      console.log("Artist Image API Response:", response.data);

      const imgUrl = response.data.imgUrl.startsWith("http")
        ? response.data.imgUrl
        : `${API_BASE_URL}/${response.data.imgUrl}`;
      setConcertImage(imgUrl);
    } catch (error) {
      console.error("Error fetching concert image:", error.message);
      Alert.alert("오류", "콘서트 이미지를 불러오는 데 실패했습니다.");
    }
  };

  // Fetch setlist for the specific past concert
  const fetchSetlist = async () => {
    try {
      console.log(`Fetching setlist for pastConcertId: ${pastconcertId}`);
      const response = await axios.get(`${API_BASE_URL}/api/setlists/past-concert/${pastconcertId}`);
      console.log("Setlist API Response:", response.data);

      const { setlist } = response.data;

      if (setlist) {
        setSetlist(setlist); // Correctly update the setlist state
      } else {
        setSetlist([]);
      }
    } catch (error) {
      console.error("Error fetching setlist:", error.message);
      Alert.alert("오류", "셋리스트를 불러오는 데 실패했습니다.");
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    await fetchConcertImage();
    await fetchSetlist();
    setLoading(false);
  };

  useEffect(() => {
    console.log("Route Params:", route.params);
    fetchData();
  }, [pastconcertId, artistId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Setlist" onBackPress={() => navigation.goBack()} />

      {/* Concert Image */}
      <View style={styles.imageContainer}>
        {concertImage ? (
          <Image source={{ uri: concertImage }} style={styles.concertImage} />
        ) : (
          <Text style={styles.noImageText}>이미지를 불러올 수 없습니다.</Text>
        )}
      </View>

      {/* Concert Info */}
      <View style={styles.infoContainer}>
        <View style={styles.concertInfoRow}>
          <Text style={styles.concertName}>{title || "Concert Name"}</Text>
          <FavoriteButton />
        </View>
        <Text style={styles.venueName}>{venueName || "Venue Name"}</Text>
        <Text style={styles.location}>{cityName || "City Name"}</Text>
      </View>

      {/* Setlist Section */}
      <Text style={styles.setlistTitle}>셋리스트</Text>
      <View style={styles.divider} />

      {/* Display Setlist */}
      {setlist.length > 0 ? (
        <FlatList
          data={setlist}
          keyExtractor={(item) => item.songId.toString()} // Use songId for unique key
          renderItem={({ item }) => (
            <SetlistItem
              key={item.order}
              index={item.order}
              songName={item.songName} // Correct the field name
            />
          )}
        />
      ) : (
        <Text style={styles.noSetlist}>셋리스트 정보 없음</Text>
      )}
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
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  concertImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 16 / 9,
    resizeMode: "contain",
  },
  noImageText: {
    fontSize: 14,
    color: "gray",
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  concertInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  concertName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold",
    flex: 1,
  },
  venueName: {
    fontSize: 15,
    fontFamily: "Pretendard-Regular",
    marginTop: 4,
    textAlign: "left",
  },
  location: {
    fontSize: 13,
    fontFamily: "Pretendard-Regular",
    marginTop: 4,
    textAlign: "left",
  },
  setlistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold",
    marginHorizontal: 16,
    marginTop: 24,
  },
  divider: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    width: "92%",
    alignSelf: "center",
    marginVertical: 8,
  },
  noSetlist: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "Pretendard-Regular",
  },
});

export default SetListScreen;
