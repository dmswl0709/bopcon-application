import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import NavigationView from "../components/NavigationView";
import ConcertListComponent from "../components/ConcertListComponent";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import axios from "axios";

export type ContentCategoryScreenProps = StackScreenProps<AppNavigationParamList, "ContentCategoryScreen">;

const API_BASE_URL = "http://localhost:8080"; // API 서버 주소

const ContentCategoryScreen = ({ route, navigation }: ContentCategoryScreenProps) => {
  const { name } = route.params; // 전달받은 카테고리 이름
  const [concerts, setConcerts] = useState([]); // 콘서트 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  // API 호출 함수
  const fetchConcerts = async () => {
    console.log("Fetching concerts for category:", name); // 디버깅 로그
    setLoading(true); // 로딩 시작
    setError(null); // 에러 초기화

    try {
      let response;
      if (name === "NEW" || name === "ALL") {
        // NEW나 ALL일 경우 모든 콘서트 데이터 가져오기
        response = await axios.get(`${API_BASE_URL}/api/new-concerts`);
      } else {
        // 특정 장르일 경우 장르별 데이터 가져오기
        response = await axios.get(`${API_BASE_URL}/api/new-concerts?genre=${encodeURIComponent(name)}`);
      }

      console.log("Fetched concerts:", response.data); // API 응답 데이터 디버깅
      setConcerts(response.data); // 콘서트 데이터 상태 업데이트
    } catch (err: any) {
      console.error("Error fetching concerts:", err.message);
      if (err.response) {
        console.error("API 응답 상태 코드:", err.response.status); // 상태 코드
        console.error("API 응답 데이터:", err.response.data); // 응답 데이터
      }
      setError("콘서트 데이터를 불러오는 데 실패했습니다."); // 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchConcerts();
  }, [name]);

  // 콘서트를 누를 때 실행되는 함수
  const handleConcertPress = (concert: any) => {
    if (concert && concert.newConcertId) {
      navigation.navigate("ConcertScreen", {
        concertId: concert.newConcertId, // `newConcertId`를 전달
      });
    } else {
      console.error("Invalid concert data:", concert);
      Alert.alert("오류", "콘서트 ID가 올바르지 않습니다.");
    }
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <NavigationView
        contentStyle={styles.navigationContent} // NavigationView 스타일 수정
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </NavigationView>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <NavigationView
        contentStyle={styles.navigationContent} // NavigationView 스타일 수정
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={fetchConcerts}>
            다시 시도하기
          </Text>
        </View>
      </NavigationView>
    );
  }

  return (
    <NavigationView
      contentStyle={styles.navigationContent} // NavigationView 스타일 수정
    >
      <View style={styles.container}>
        <Text style={styles.header}>{name}</Text>
        {/* ConcertListComponent에 onConcertPress 전달 */}
        <ConcertListComponent concerts={concerts} onConcertPress={handleConcertPress} horizontal={false} />
      </View>
    </NavigationView>
  );
};

const styles = StyleSheet.create({
  navigationContent: {
    marginHorizontal: 8, // NavigationView 양옆 여백 줄임
    marginTop: 8, // NavigationView 상단 여백 줄임
    marginBottom: 8, // 하단 여백 줄임
  },
  container: {
    flex: 1,
    paddingHorizontal: 8, // 내부 패딩 줄임
    paddingTop: 5, // 상단 패딩 줄임
  },
  header: {
    fontSize: 25, 
    fontWeight: "bold",
    marginBottom: 12, // 헤더 하단 여백 줄임
    marginLeft: 12, // 헤더 왼쪽 여백 줄임
    marginTop: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default gestureHandlerRootHOC(ContentCategoryScreen);