import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";
import ConcertRow from "../components/ConcertRow";
import { SafeAreaView } from "react-native";
import axios from "axios";

const ArtistScreen = ({ route, navigation }) => {
  // route.params 확인 및 기본값 설정
  const {
      artistId = null, // 반드시 추가
      artistName = "Default Artist Name",
      artistDetail = "This is a brief artist detail or bio.",
      instagramUrl = "https://instagram.com",
      spotifyUrl = "https://spotify.com",
    } = route.params || {};

  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("곡 랭킹");

  useEffect(() => {
    if (!artistId) {
      console.error("artistId is undefined in route.params");
      setIsLoading(false); // 로딩 상태를 종료합니다.
      return;
    }
  
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/artists/${artistId}`);
        setArtistData(response.data); // 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchArtistData();
  }, [artistId]); // artistId가 변경될 때마다 데이터를 다시 가져옵니다.

  const upcomingConcert = {
    dateYear: "2025",
    dateDay: "01/12",
    description: "벤슨 분 첫 단독 내한 공연",
  };

  const tempSongData = [
    "Song 1",
    "Song 2",
    "Song 3",
    "Song 4",
    "Song 5",
    "Song 6",
    "Song 7",
    "Song 8",
    "Song 9",
    "Song 10",
  ];
  const [visibleSongs, setVisibleSongs] = useState(tempSongData.slice(0, 6));

  const tempConcertData = [
    {
      dateYear: "2024",
      dateDay: "10/26",
      description: "Benson Boone at Austin City Limits 2024",
    },
    {
      dateYear: "2024",
      dateDay: "10/26",
      description: "콘서트 제목 1",
    },
    {
      dateYear: "2024",
      dateDay: "10/26",
      description: "콘서트 제목 2",
    },
    {
      dateYear: "2024",
      dateDay: "10/26",
      description: "콘서트 제목 3",
    },
    {
      dateYear: "2024",
      dateDay: "10/26",
      description: "콘서트 제목 4",
    },
  ];
  const [visibleConcerts, setVisibleConcerts] = useState(tempConcertData.slice(0, 3));

  const tempBoardData = [
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
  ];

  const renderRankingContent = () => (
    <View>
      <Text style={styles.sectionTitle}>최근 20개 콘서트 기준</Text>
      {visibleSongs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          곡 데이터가 없습니다.
        </Text>
      ) : (
        <FlatList
          data={visibleSongs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.rankRow}>
              <Text
                style={[
                  styles.rankNumber,
                  index === 0 && styles.firstRank,
                  index === 1 && styles.secondRank,
                  index === 2 && styles.thirdRank,
                ]}
              >
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </Text>
              <Text style={styles.rankSong}>{item}</Text>
            </View>
          )}
        />
      )}
      {visibleSongs.length < tempSongData.length && (
        <TouchableOpacity onPress={() => setVisibleSongs(tempSongData)}>
          <Text style={styles.moreButton}>더보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPastConcertContent = () => (
    <View>
      <FlatList
        data={visibleConcerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.concertRowContainer}>
            <ConcertRow
              dateYear={item.dateYear}
              dateDay={item.dateDay}
              description={item.description}
              onPress={() =>
                navigation.navigate("SetListScreen", {
                  concertDetails: item, // 필요시 item 데이터 전달
                })
              }
            />
          </View>
        )}
      />
      {visibleConcerts.length < tempConcertData.length && (
        <TouchableOpacity
          onPress={() => setVisibleConcerts(tempConcertData)}
          style={{ alignItems: "center" }}
        >
          <Text style={styles.moreButton}>더보기</Text>
        </TouchableOpacity>
      )}
      <View style={styles.lightDivider} />
    </View>
  );

  const renderBoardContent = () => (
    <View>
      <View style={styles.boardHeader}>
        <Text style={styles.boardTitle}>게시판</Text>
        <TouchableOpacity onPress={() => navigation.navigate("BoardScreen")}>
          <Text style={styles.moreButtonGray}>더보기</Text>
        </TouchableOpacity>
      </View>
      {tempBoardData.map((post, index) => (
        <View key={index} style={styles.boardRow}>
          <Text style={styles.boardTitle}>{post.title}</Text>
          <Text style={styles.boardContent}>{post.content}</Text>
          <Text style={styles.boardDate}>
            {post.date} | {post.nickname}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "곡 랭킹":
        return renderRankingContent();
      case "지난 공연":
        return renderPastConcertContent();
      case "게시판":
        return renderBoardContent();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header title="Artist" onBackPress={() => navigation.goBack()} />
            <View style={styles.artistInfoSection}>
              <Image
                source={require("../assets/images/sampleimg4.png")}
                style={styles.artistImage}
              />
              <View style={styles.socialMediaContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("WebViewScreen", { url: instagramUrl })
                  }
                >
                  <Image
                    source={require("../assets/icons/InstagramLogo.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("WebViewScreen", { url: spotifyUrl })
                  }
                >
                  <Image
                    source={require("../assets/icons/SpotifyLogo.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.artistNameRow}>
              <View style={styles.artistNameContainer}>
                <Text style={styles.artistName}>{artistName}</Text>
                <Text style={styles.artistDetail}>{artistDetail}</Text>
              </View>
              <FavoriteButton />
            </View>
            <Text style={styles.upcomingTitle}>내한 예정</Text>
            <View style={styles.divider1} />
            <ConcertRow
              dateYear={upcomingConcert.dateYear}
              dateDay={upcomingConcert.dateDay}
              description={upcomingConcert.description}
              onPress={() =>
                navigation.navigate("ConcertScreen", {
                  concertDetails: upcomingConcert, // 필요시 전달할 데이터
                })
              }
            />
            <View style={styles.tabRow}>
              {["곡 랭킹", "지난 공연", "게시판"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.activeTabButton,
                  ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === tab && styles.activeTabText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }
          data={[]} // 데이터는 렌더링하지 않음
          renderItem={null}
          ListFooterComponent={renderContent()}
        />
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: -55,
    paddingHorizontal: 16,
  },
  artistInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  artistImage: {
    width: 165,
    height: 165,
    borderRadius: 4,
    resizeMode: "cover",
    marginTop: 10,
  },
  socialMediaContainer: {
    marginLeft: 18,
    justifyContent: "space-around",
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  artistNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  artistName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artistDetail: {
    fontSize: 14,
    color: "gray",
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider1: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    width:"98%",
    marginLeft: 2,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    color: "gray",
  },
  activeTabText: {
    color: "black",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 16,
  },
  rankNumber: {
    width: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 16,
  },
  firstRank: {
    backgroundColor: "yellow",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  secondRank: {
    backgroundColor: "lightgray",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  thirdRank: {
    backgroundColor: "gold",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  rankSong: {
    flex: 1,
  },
  moreButton: {
    textAlign: "center",
    marginTop: 16,
    color: "gray",
  },
  concertRowContainer: {
    marginLeft: 16, // ConcertRow의 왼쪽 여백
    },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    marginLeft: 5, // 왼쪽 여백 확실히 설정
    marginRight: 16, // 오른쪽 여백 설정
    alignSelf: "stretch", // 부모 컨테이너의 가로 공간을 채움
      },
  boardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
  },
  boardRow: {
    marginBottom: 16,
  },
  boardTitle: {
    fontSize: 15,
    fontFamily: "Pretendard-Bold",
    marginBottom: 10,
    marginLeft:18,
  },
  boardContent: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
    marginLeft: 18,
  },
  boardDate: {
    fontSize: 12,
    color: "gray",
    marginLeft:16,
  },
  lightDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 16,
  },
  moreButtonGray: {
    textAlign: "center",
    color: "gray",
    marginRight: 32,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    marginLeft: 16, // Divider 시작 위치를 왼쪽으로 정렬
    width: "90%", // Divider의 길이 설정
  },
  sectionTitle: {
    fontSize: 14, // 폰트 크기
    fontFamily: "Pretendard-Regular", // Pretendard-Regular 적용
    marginLeft: 16, // 좌측 여백
    marginBottom: 12, // 아래 여백 추가
  },
});

export default ArtistScreen;