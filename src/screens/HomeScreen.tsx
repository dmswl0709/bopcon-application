import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import NavigationView from "../components/NavigationView";
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertListComponent from "../components/ConcertListComponent";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";
import { fetchConcerts } from "../apis/concerts";
import Svg, { Path } from "react-native-svg";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const [concerts, setConcerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConcerts = async () => {
    try {
      console.log("Fetching concerts from API..."); // 디버깅: API 호출 전 로그
      setIsLoading(true);
      const data = await fetchConcerts();

      console.log("Fetched concerts before sorting:", data); // 디버깅: API에서 받아온 데이터 출력

      // `newConcertId` 기준으로 내림차순 정렬
      const sortedData = data.sort((a, b) => b.id - a.id);
      console.log("Sorted concerts by newConcertId:", sortedData); // 디버깅: 정렬된 데이터 출력

      setConcerts(sortedData);
    } catch (error) {
      console.error("Error loading concerts:", error);
      Alert.alert("오류", "콘서트 데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.log("Finished fetching and sorting concerts."); // 디버깅: API 호출 종료 시 로그
    }
  };

  useEffect(() => {
    console.log("HomeScreen mounted. Loading concerts..."); // 디버깅: 컴포넌트가 처음 마운트될 때
    loadConcerts();
  }, []);

  const handleConcertPress = (concert) => {
    console.log("Concert pressed:", concert); // 디버깅: 클릭된 콘서트 데이터 출력
    navigation.navigate("ConcertScreen", {
      concertId: concert.id,
    });
  };

  const handleSearchPress = () => {
    console.log("Navigating to SearchScreen"); // 디버깅: 검색 버튼 클릭
    navigation.navigate("SearchScreen");
  };

  const handleMorePress = (genre) => {
    console.log(`Navigating to ContentCategoryScreen for genre: ${genre}`); // 디버깅: 카테고리 이동
    navigation.navigate("ContentCategoryScreen", { name: genre });
  };

  console.log("Concerts state before rendering:", concerts); // 디버깅: 렌더링 직전 state 확인

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
        onPress={() => handleMorePress("NEW")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts} // 정렬된 데이터 그대로 전달
        onConcertPress={handleConcertPress}
      />

      {/* ROCK Section */}
      <MenuTitle
        title={"ROCK"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "ROCK" }}
        onPress={() => handleMorePress("ROCK")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.filter((concert) => concert.genre === "ROCK")}
        onConcertPress={handleConcertPress}
      />

      {/* POP Section */}
      <MenuTitle
        title={"POP"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "POP" }}
        onPress={() => handleMorePress("POP")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.filter((concert) => concert.genre === "POP")}
        onConcertPress={handleConcertPress}
      />

      {/* J-POP Section */}
      <MenuTitle
        title={"JPOP"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "JPOP" }}
        onPress={() => handleMorePress("JPOP")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.filter((concert) => concert.genre === "JPOP")}
        onConcertPress={handleConcertPress}
      />

      {/* HIPHOP Section */}
      <MenuTitle
        title={"HIPHOP"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "HIPHOP" }}
        onPress={() => handleMorePress("HIPHOP")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.filter((concert) => concert.genre === "HIPHOP")}
        onConcertPress={handleConcertPress}
      />

      {/* R&B Section */}
      <MenuTitle
        title={"R&B"}
        navigateName="ContentCategoryScreen"
        navigateParams={{ name: "R&B" }}
        onPress={() => handleMorePress("R&B")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts.filter((concert) => concert.genre === "R&B")}
        onConcertPress={handleConcertPress}
      />
    </NavigationView>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 16,
  },
});

export default HomeScreen;