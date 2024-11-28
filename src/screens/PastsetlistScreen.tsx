import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppNavigatorParamList } from "../navigation/AppNavigatorParamList";
import Header from "../components/Header";
import ConcertRow from "../components/ConcertRow";
import { fetchPastConcertsByArtistName } from "../apis/concerts";

type PastSetListScreenRouteProp = RouteProp<AppNavigatorParamList, "PastSetListScreen">;

const PastSetListScreen = ({ navigation }) => {
  const route = useRoute<PastSetListScreenRouteProp>();
  const { artistName } = route.params; // artistName을 사용하여 API 호출

  const [pastConcerts, setPastConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const concerts = await fetchPastConcertsByArtistName(artistName);
        setPastConcerts(concerts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Past Setlist" onBackPress={() => navigation.goBack()} />
      <Text style={styles.artistName}>{artistName}</Text>
      <ScrollView>
        {pastConcerts.map((concert) => (
          <ConcertRow
            key={concert.id}
            dateYear={new Date(concert.date).getFullYear().toString()}
            dateDay={`${new Date(concert.date).getMonth() + 1}/${new Date(concert.date).getDate()}`}
            description={`${concert.venueName} - ${concert.cityName}`}
            onPress={() =>
              navigation.navigate("SetListScreen", {
                concertName: concert.venueName,
                venueName: concert.venueName,
                location: concert.cityName,
                setlist: [], // 명세에 setlist가 없으므로 빈 배열로 전달
              })
            }
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  artistName: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
});

export default PastSetListScreen;
