import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, Alert } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import NavigationView from "../components/NavigationView";
import Stack from "../components/Stack";
import MenuTitle from "../components/MenuTitle";
import ConcertListComponent from "../components/ConcertListComponent";
import AppNavigatorParamList from "../navigation/AppNavigatorParamList";
import { fetchConcerts } from "../apis/concerts"; // API 호출 함수 임포트
import Sample1 from "../assets/images/sampleimg1.jpg";
import Sample2 from "../assets/images/sampleimg2.png";
import Sample3 from "../assets/images/sampleimg3.png";

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<AppNavigatorParamList>>();
  const [concerts, setConcerts] = useState([]); // 콘서트 데이터 상태 관리
  const [isLoading, setIsLoading] = useState(true);

  // 임시 데이터
  const temporaryConcerts = [
    {
      id: "1",
      posterUrl: Sample1, // Sample 이미지 사용
      title: "임시 콘서트 1",
      subTitle: "이 콘서트는 임시 데이터입니다.",
      date: "2024-12-01",
      venueName: "서울 월드컵 경기장",
      cityName: "서울",
      countryName: "대한민국",
    },
    {
      id: "2",
      posterUrl: Sample2, // Sample 이미지 사용
      title: "임시 콘서트 2",
      subTitle: "이 콘서트는 임시 데이터입니다.",
      date: "2024-12-10",
      venueName: "부산 아시아드 주경기장",
      cityName: "부산",
      countryName: "대한민국",
    },
    {
      id: "3",
      posterUrl: Sample3, // Sample 이미지 사용
      title: "임시 콘서트 3",
      subTitle: "이 콘서트는 임시 데이터입니다.",
      date: "2024-12-20",
      venueName: "인천 문학 경기장",
      cityName: "인천",
      countryName: "대한민국",
    },
  ];

  // 콘서트 데이터 로드 함수
  const loadConcerts = async () => {
    try {
      setIsLoading(true);
      const concertData = await fetchConcerts(); // API 호출
      if (concertData && concertData.length > 0) {
        setConcerts(concertData); // 데이터 저장
      } else {
        console.warn("No concerts available, using temporary data.");
        setConcerts(temporaryConcerts); // 임시 데이터 사용
      }
    } catch (error) {
      console.error("Error loading concerts:", error);
      Alert.alert("오류", "콘서트 데이터를 불러오지 못했습니다. 임시 데이터를 사용합니다.");
      setConcerts(temporaryConcerts); // 오류 발생 시 임시 데이터 사용
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConcerts(); // 컴포넌트 마운트 시 데이터 로드
  }, []);

  const handleConcertPress = (concert: any) => {
    navigation.navigate("ConcertScreen", { concert });
  };

  return (
    <NavigationView navigationViewScrollable>
      <Stack alignment="start">
        {concerts.length > 0 && (
          <TouchableOpacity onPress={() => handleConcertPress(concerts[0])}>
            <Image
              source={concerts[0].posterUrl}
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

      <MenuTitle title={"NEW"} />
      <ConcertListComponent
        horizontal
        concerts={concerts}
        onConcertPress={handleConcertPress}
      />
      <MenuTitle title={"JPOP"} />
      <ConcertListComponent
        horizontal
        concerts={concerts}
        onConcertPress={handleConcertPress}
      />
      <MenuTitle title={"POP"} />
      <ConcertListComponent
        horizontal
        concerts={concerts}
        onConcertPress={handleConcertPress}
      />
    </NavigationView>
  );
}

export default HomeScreen;