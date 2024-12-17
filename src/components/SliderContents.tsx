import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import sliderData from "../constants/sliderData";
import { fetchConcertData } from "../apis/concerts";

const { width, height } = Dimensions.get("window");

const SliderContents: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  // 5초마다 자동 슬라이드 이동
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 슬라이드 클릭 시 콘서트로 이동
  const handlePostClick = async (concertId: string) => {
    try {
      const concertData = await fetchConcertData(concertId);
      navigation.navigate("ConcertScreen", { concertId, concertDetails: concertData });
    } catch (error) {
      console.error("Failed to navigate to ConcertScreen:", error);
    }
  };

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
            {/* 그림자 효과 */}
            <View style={styles.overlay} />
            {/* 텍스트 레이어 */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}

      {/* 왼쪽 버튼 */}
      <TouchableOpacity style={styles.leftArea} onPress={handlePrev} />

      {/* 오른쪽 버튼 */}
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
});

export default SliderContents;