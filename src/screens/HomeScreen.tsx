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

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const [concerts, setConcerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConcerts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchConcerts();
      setConcerts(data);
    } catch (error) {
      console.error("Error loading concerts:", error);
      Alert.alert("오류", "콘서트 데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConcerts();
  }, []);

  const handleConcertPress = (concert) => {
    navigation.navigate("ConcertScreen", {
      concertId: concert.id,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchScreen");
  };

  const handleMorePress = (genre) => {
    navigation.navigate("ContentCategoryScreen", { name: genre });
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
        onPress={() => handleMorePress("NEW")}
      />
      <ConcertListComponent
        horizontal
        concerts={concerts}
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

        {/* HIPHOPSection */}
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
}

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 16,
  },
});

export default HomeScreen;