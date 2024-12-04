import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, Alert } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationView from "../components/NavigationView";
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertListComponent from "../components/ConcertListComponent";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";
import { fetchConcerts } from "../apis/concerts";

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
      const data = await fetchConcerts();
      setConcerts(
        data.map((concert) => ({
          ...concert,
          posterUrl: concert.posterUrl || "https://via.placeholder.com/150", // 기본 이미지 URL 설정
        }))
      );
    } catch (error) {
      console.error("Error loading concerts:", error);
      setConcerts(
        temporaryConcerts.map((concert) => ({
          ...concert,
          posterUrl: "https://via.placeholder.com/150", // 기본 이미지 URL 설정
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConcerts(); // 콘서트 데이터 로드
  }, []);

  const handleConcertPress = (concert) => {
    if (concert && concert.id) {
      navigation.navigate("ConcertScreen", {
        concertId: concert.id, // 정확한 ID 전달
      });
    } else {
      console.error("Invalid concert data:", concert);
      Alert.alert("오류", "콘서트 ID가 올바르지 않습니다.");
    }
  };

  return (
    <NavigationView navigationViewScrollable>
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
        navigateName="ContentCategoryScreen" // ContentCategoryScreen으로 이동
        navigateParams={{ name: "NEW" }} // 전달할 카테고리 이름
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

export default HomeScreen;
