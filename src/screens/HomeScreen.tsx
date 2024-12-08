import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationView from "../components/NavigationView";
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertListComponent from "../components/ConcertListComponent";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";
import { fetchConcerts } from "../apis/concerts";
import Svg, { Path } from "react-native-svg";

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const [concerts, setConcerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const temporaryConcerts = [
    {
      id: "1",
      posterUrl: "",
      title: "임시 콘서트 1",
      date: "2024-12-01",
      venueName: "서울 월드컵 경기장",
      cityName: "서울",
      countryName: "대한민국",
    },
    {
      id: "2",
      posterUrl: "",
      title: "임시 콘서트 2",
      date: "2024-12-10",
      venueName: "부산 아시아드 주경기장",
      cityName: "부산",
      countryName: "대한민국",
    },
    {
      id: "3",
      posterUrl: "",
      title: "임시 콘서트 3",
      date: "2024-12-20",
      venueName: "인천 문학 경기장",
      cityName: "인천",
      countryName: "대한민국",
    },
  ];

  const loadConcerts = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching concerts...");
      const data = await fetchConcerts();
      console.log("Concerts fetched successfully:", data);

      setConcerts(
        data.map((concert) => ({
          ...concert,
          posterUrl: concert.posterUrl || "https://via.placeholder.com/150",
        }))
      );
    } catch (error) {
      console.error("Error loading concerts:", error);
      Alert.alert("오류", "콘서트 데이터를 불러오는 중 문제가 발생했습니다.");

      // Set temporary concerts for fallback
      setConcerts(
        temporaryConcerts.map((concert) => ({
          ...concert,
          posterUrl: "https://via.placeholder.com/150",
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("HomeScreen mounted.");
    loadConcerts();
  }, []);

  const handleConcertPress = (concert) => {
    console.log("Concert pressed:", concert);
    if (concert && concert.id) {
      navigation.navigate("ConcertScreen", {
        concertId: concert.id,
      });
    } else {
      console.error("Invalid concert data:", concert);
      Alert.alert("오류", "콘서트 ID가 올바르지 않습니다.");
    }
  };

  const handleSearchPress = () => {
    try {
      console.log("Search icon pressed. Navigating to SearchScreen...");
      navigation.navigate("SearchScreen"); // SearchScreen으로 이동
    } catch (error) {
      console.error("Error navigating to SearchScreen:", error);
      Alert.alert("오류", "검색 화면으로 이동할 수 없습니다.");
    }
  };

  return (
    <NavigationView
      navigationViewScrollable
      headerRight={
        <TouchableOpacity onPress={handleSearchPress} style={styles.searchIcon}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm0-1.5a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM21 21l-4.35-4.35"
              stroke="black"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      }
    >
      <Stack alignment="start">
        {concerts.length > 0 && (
          <TouchableOpacity onPress={() => handleConcertPress(concerts[0])}>
            <Image
              source={
                concerts[0].posterUrl
                  ? { uri: concerts[0].posterUrl }
                  : require("../assets/images/sampleimg1.jpg")
              }
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").width * 0.6,
                resizeMode: "cover",
              }}
            />
            <Text
              style={{
                position: "absolute",
                fontWeight: "bold",
                fontSize: 24,
                color: "white",
                paddingHorizontal: 16,
                paddingTop: Dimensions.get("window").height * 0.2,
              }}
            >
              {concerts[0].title}
            </Text>
          </TouchableOpacity>
        )}
      </Stack>

      {/* NEW Section */}
      <MenuTitle
        title={"NEW"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "NEW" }}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.map((concert) => ({
          ...concert,
          posterUrl: concert.posterUrl || "https://via.placeholder.com/150",
        }))}
        onConcertPress={handleConcertPress}
      />

      {/* JPOP Section */}
      <MenuTitle
        title={"JPOP"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "JPOP" }}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts
          .filter((concert) => concert.genre === "JPOP")
          .map((concert) => ({
            ...concert,
            posterUrl: concert.posterUrl || "https://via.placeholder.com/150",
          }))}
        onConcertPress={handleConcertPress}
      />

      {/* POP Section */}
      <MenuTitle
        title={"POP"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "POP" }}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts
          .filter((concert) => concert.genre === "POP")
          .map((concert) => ({
            ...concert,
            posterUrl: concert.posterUrl || "https://via.placeholder.com/150",
          }))}
        onConcertPress={handleConcertPress}
      />
    </NavigationView>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 16,
  },
});

export default HomeScreen;