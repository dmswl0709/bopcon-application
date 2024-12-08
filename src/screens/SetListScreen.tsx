import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";
import SetlistItem from "../components/SetlistItem";

interface SongType {
  order: number;
  title: string;
  ytLink: string | null;
}

interface ConcertData {
  venueName: string;
  cityName: string;
  date: string;
  setlists: SongType[];
}

interface RouteParams {
  artistId: string;
  pastConcertId: string;
  title?: string;
  cityName?: string;
  venueName?: string;
}

interface SetListScreenProps {
  route: {
    params: RouteParams;
  };
  navigation: any;
}

const API_BASE_URL = "http://localhost:8080";

const SetListScreen: React.FC<SetListScreenProps> = ({ route, navigation }) => {
  const { artistId, pastConcertId, title, cityName, venueName } = route.params;

  const [concertImage, setConcertImage] = useState<string>("");
  const [setlist, setSetlist] = useState<SongType[]>([]);
  const [concertInfo, setConcertInfo] = useState<ConcertData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchConcertImage = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/artists/${artistId}`);
      const imgUrl = response.data.imgUrl.startsWith("http")
        ? response.data.imgUrl
        : `${API_BASE_URL}/${response.data.imgUrl}`;
      setConcertImage(imgUrl);
    } catch (error: any) {
      console.error("Error fetching concert image:", error.message);
      Alert.alert("Error", "Failed to load concert image.");
    }
  };

  const fetchSetlist = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/artists/${artistId}/past-concerts`);
      const concerts = response.data;

      const concert = concerts.find((c) => c.pastConcertId === Number(pastConcertId));
      if (!concert) {
        console.warn("No concert found for the given ID.");
        setSetlist([]);
        return;
      }

      const formattedSetlist = concert.setlists.map((item: any) => ({
        order: item.order,
        title: item.song?.title || "Unknown Song",
        ytLink: item.song?.ytLink || null,
      }));

      setSetlist(formattedSetlist);

      setConcertInfo({
        venueName: concert.venueName,
        cityName: concert.cityName,
        date: concert.date.join("-"),
        setlists: formattedSetlist,
      });
    } catch (error: any) {
      console.error("Error fetching setlist:", error.message);
      Alert.alert("Error", "Failed to load setlist data.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchConcertImage();
    await fetchSetlist();
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [artistId, pastConcertId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Setlist" onBackPress={() => navigation.goBack()} />

      <View style={styles.imageContainer}>
        {concertImage ? (
          <Image source={{ uri: concertImage }} style={styles.concertImage} />
        ) : (
          <Text style={styles.noImageText}>Image not available</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.concertInfoRow}>
          <Text style={styles.concertName}>{title || "Concert Name"}</Text>
          <FavoriteButton />
        </View>
        <Text style={styles.venueName}>{concertInfo?.venueName || venueName || "Venue Name"}</Text>
        <Text style={styles.location}>{concertInfo?.cityName || cityName || "City Name"}</Text>
        <Text style={styles.date}>{concertInfo?.date}</Text>
      </View>

      <Text style={styles.setlistTitle}>셋리스트</Text>
      <View style={styles.divider} />

      {setlist.length > 0 ? (
        <FlatList
          data={setlist.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.order === item.order && t.title === item.title)
          )}
          keyExtractor={(item) => `${item.order}-${item.title}`}
          renderItem={({ item }) => (
            <SetlistItem index={item.order} songTitle={item.title} ytLink={item.ytLink} />
          )}
        />
      ) : (
        <Text style={styles.noSetlist}>No setlist available for this concert.</Text>
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
  },
  venueName: {
    fontSize: 15,
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
    color: "gray",
  },
  setlistTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
});

export default SetListScreen;