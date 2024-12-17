import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const SliderContents: React.FC = () => {
  const navigation = useNavigation();
  const [sliderData, setSliderData] = useState([]); // 슬라이드 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 초기 데이터
  const initialData = [
    { title: "벤슨 분 첫 단독 내한공연", concertId: "33" },
    { title: "콜드플레이 내한공연", concertId: "38" },
    { title: "오아시스 내한공연", concertId: "2" },
    { title: "요네즈 켄시 내한공연", concertId: "30" },
  ];

  // 슬라이드 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = initialData.map(async (item) => {
          const response = await axios.get(
            `https://api.bopcon.site/api/new-concerts/${item.concertId}`
          );
          return {
            ...item,
            image: { uri: response.data.posterUrl }, // API의 posterUrl 사용
          };
        });

        const data = await Promise.all(promises); // 모든 요청 완료
        setSliderData(data);
      } catch (error) {
        console.error("Error fetching slider data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 자동 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderData]);

  // 이전 슬라이드로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
  };

  // 콘서트 상세 페이지 이동
  const handlePostClick = (concertId: string) => {
    navigation.navigate("ConcertScreen", { concertId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      {sliderData.map((slide, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => handlePostClick(slide.concertId)}
          style={[
            styles.slide,
            index === currentIndex ? styles.activeSlide : styles.hiddenSlide,
          ]}
        >
          <ImageBackground
            source={slide.image}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}

      {/* 왼쪽 영역 - 이전 슬라이드 */}
      <TouchableOpacity style={styles.leftArea} onPress={handlePrev} />

      {/* 오른쪽 영역 - 다음 슬라이드 */}
      <TouchableOpacity style={styles.rightArea} onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: height * 0.3,
    position: "relative",
    overflow: "hidden",
  },
  slide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  activeSlide: {
    opacity: 1,
    zIndex: 10,
  },
  hiddenSlide: {
    opacity: 0,
    zIndex: -1,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  textContainer: {
    marginBottom: 30,
    marginLeft: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  leftArea: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "20%",
    zIndex: 20,
  },
  rightArea: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "20%",
    zIndex: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SliderContents;