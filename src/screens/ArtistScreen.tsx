import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";
import ConcertRow from "../components/ConcertRow";
import { SafeAreaView } from "react-native";
import InstagramLogo from "../assets/icons/InstagramLogo.svg";
import SpotifyLogo from "../assets/icons/SpotifyLogo.svg";
import { fetchUpcomingConcerts, fetchSongRanking } from "../apis/concerts";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { Linking } from "react-native";

const ArtistScreen = ({ route, navigation }) => {
  const {
    artistId = null,
    name = "Default Artist Name",
    krName = "Default Artist KR Name",
    snsUrl = "https://instagram.com",
    mediaUrl = "https://spotify.com",
  } = route.params || {};

  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("곡 랭킹");
  const [visibleSongs, setVisibleSongs] = useState([]);
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [pastConcerts, setPastConcerts] = useState([]); // 지난 공연 데이터 상태

  // Fetch artist data
  useEffect(() => {
    if (!artistId) {
      console.error("artistId is undefined in route.params");
      setIsLoading(false);
      return;
    }

    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/artists/${artistId}`);
        console.log("Artist API Response:", response.data);
        setArtistData(response.data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  useEffect(() => {
    const getUpcomingConcerts = async () => {
      try {
        const concerts = await fetchUpcomingConcerts(artistId);
        console.log("Upcoming concerts data in ArtistScreen:", concerts); // 콘솔 로그 추가
        if (concerts && concerts.length > 0) {
          setUpcomingConcerts(concerts);
        } else {
          console.warn("No upcoming concerts found. Using fallback data.");
          setUpcomingConcerts(tempConcertData); // fallback
        }
      } catch (error) {
        console.error("Error fetching upcoming concerts:", error);
        setUpcomingConcerts(tempConcertData); // fallback
      }
    };
  
    getUpcomingConcerts();
  }, [artistId]);

// 곡 랭킹 불러오기 useEffect
useEffect(() => {
  const loadSongRanking = async () => {
    try {
      // artistData에서 mbid 가져오기
      const artistId = artistData?.artistId;

      if (!artistId) {
        console.error("artistId가 없습니다. 곡 랭킹을 불러올 수 없습니다.");
        return;
      }

      console.log(`Fetching song rankings for artistId: ${artistId}`);
      const response = await axios.get(`http://localhost:8080/api/artists/${artistId}/song-ranking`);
      console.log("Fetched song rankings:", response.data);

      // API 응답 데이터를 그대로 사용
      setVisibleSongs(response.data || []); // 데이터가 없으면 빈 배열로 설정
    } catch (error) {
      console.error("Error fetching song rankings:", error);
    }
  };

  if (artistData) {
    loadSongRanking(); // artistData가 있을 때만 실행
  }
}, [artistData]);


// 곡 랭킹 표시
const renderRankingContent = () => {
  // 곡 데이터를 정렬한 후 상위 10개만 선택
  const sortedSongs = visibleSongs
    .sort((a, b) => b.count - a.count) // count 기준으로 내림차순 정렬
    .slice(0, 20); // 상위 10개 선택

  return (
    <View>
      <Text style={styles.sectionTitle}>최근 20개 콘서트 기준</Text>
      {sortedSongs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 16 }}>곡 데이터가 없습니다.</Text>
      ) : (
        <FlatList
          data={sortedSongs} // 정렬된 데이터 전달
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
              <Text style={styles.rankSong}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

  const upcomingConcert = {
    dateYear: "2025",
    dateDay: "01/12",
    description: "벤슨 분 첫 단독 내한 공연",
  };


  const renderUpcomingConcerts = () => (
    <View>
      {upcomingConcerts.length > 0 ? (
        upcomingConcerts.map((concert, index) => {
          let year = "N/A";
          let month = "N/A";
          let day = "N/A";
  
          try {
            if (typeof concert.date === "string") {
              // 문자열로 제공되는 날짜 처리
              const parsedDate = parseISO(concert.date.trim()); // ISO 형식으로 변환
              if (!isNaN(parsedDate)) {
                year = format(parsedDate, "yyyy"); // 연도 추출
                month = format(parsedDate, "MM"); // 월 추출
                day = format(parsedDate, "dd"); // 일 추출
              } else {
                console.warn("Invalid date format received:", concert.date);
              }
            } else if (Array.isArray(concert.date) && concert.date.length === 3) {
              // 배열 형태의 날짜 처리
              [year, month, day] = concert.date.map((item) => item.toString());
            } else {
              console.warn("Unsupported date format:", concert.date);
            }
          } catch (error) {
            console.error("Error parsing date:", concert.date, error);
          }
  
          return (
            <ConcertRow
              key={index}
              dateYear={year}
              dateDay={`${month}/${day}`}
              description={concert.title || "No title"}
              onPress={() =>
                navigation.navigate("ConcertScreen", {
                  concertDetails: {
                    ...concert,
                    dateYear: year,
                    dateDay: `${month}/${day}`,
                    id: concert.id || concert.newConcertId || `generated-id-${index}`,
                    artistName: artistData?.name, // 추가 데이터 전달
                  },
                  concertId: concert.newConcertId || `generated-id-${index}`,
                })
              }
            />
          );
        })
      ) : (
        <Text style={{ textAlign: "center", color: "gray" }}>
          내한 예정 콘서트가 없습니다.
        </Text>
      )}
    </View>
  );
  
  

  const renderContent = () => {
    switch (activeTab) {
      case "곡 랭킹":
        return renderRankingContent();
      case "지난 공연":
        return renderPastConcertContent(); // 
      case "게시판":
        return <Text style={{ textAlign: "center" }}>게시판 콘텐츠가 여기에 표시됩니다.</Text>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadPastConcerts = async () => {
      try {
        const artistName = artistData?.artistId;
        if (!artistId) {
          console.error("아티스트 이름이 없습니다.");
          return;
        }
        console.log(`Fetching past concerts for artist: ${artistId}`);
        const response = await axios.get(`http://localhost:8080/api/artists/${artistId}/past-concerts`);
        console.log("Fetched past concerts:", response.data);
  
        if (Array.isArray(response.data)) {
          setPastConcerts(response.data); // 올바른 데이터 배열 설정
        } else {
          console.error("API 응답이 배열 형태가 아닙니다.");
          setPastConcerts([]); // 기본값 설정
        }
      } catch (error) {
        console.error("Error fetching past concerts:", error);
      }
    };
  
    if (artistData) {
      loadPastConcerts();
    }
  }, [artistData]);

  const renderPastConcertContent = () => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        {pastConcerts.length > 0 ? (
          pastConcerts.map((concert, index) => {
            // date가 배열인지 확인하고 처리
            let year = "N/A";
            let month = "N/A";
            let day = "N/A";
  
            if (Array.isArray(concert.date) && concert.date.length === 3) {
              [year, month, day] = concert.date; // 배열에서 연, 월, 일을 추출
            }
  
            return (
              <ConcertRow
                key={index}
                dateYear={year}
                dateDay={`${month}/${day}`}
                description={
                  concert.title
                    ? concert.title
                    : `${concert.venueName || ""}, ${concert.cityName || ""}` ||
                      "공연 제목 없음"
                }
                onPress={() =>
                  navigation.navigate("ConcertScreen", {
                    concertDetails: {
                      ...concert,
                      dateYear: year,
                      dateDay: `${month}/${day}`,
                      artistName: artistData?.name,
                    },
                    concertId: concert.pastConcertId,
                  })
                }
              />
            );
          })
        ) : (
          <Text style={{ textAlign: "center", color: "gray", marginTop: 16 }}>
            지난 공연 데이터가 없습니다.
          </Text>
        )}
      </View>
    );
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header title="Artist" onBackPress={() => navigation.goBack()} />
            <View style={styles.artistInfoSection}>
              <Image source={{ uri: artistData?.imgUrl }} style={styles.artistImage} />
              <View style={styles.socialMediaRow}>
                <TouchableOpacity onPress={() => Linking.openURL(artistData?.snsUrl || snsUrl)}>
                  <InstagramLogo width={40} height={40} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(artistData?.mediaUrl || mediaUrl)}>
                  <SpotifyLogo width={40} height={40} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
            </View>
              <View style={styles.artistNameRow}>
                <View style={styles.artistNameContainer}>
                  <Text style={styles.artistName}>{artistData?.name || name}</Text>
                  <Text style={styles.artistKrName}>{artistData?.krName || krName}</Text>
                </View>
                <FavoriteButton />
              </View>
            <Text style={styles.upcomingTitle}>내한 예정</Text>
            {renderUpcomingConcerts()}
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
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        data={[]} // 콘텐츠는 렌더링하지 않음
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
    alignItems: "center", // 이미지와 로고를 수직 중앙 정렬
    marginBottom: 16, // 전체 섹션 아래 여백
  },
  artistImage: {
    width: 220,
    height: 220,
    borderRadius: 2,
    resizeMode: "cover",
    marginBottom: 10, // 로고와의 간격
  },
  socialMediaRow: {
    flexDirection: "row", // 로고들을 가로로 정렬
    justifyContent: "center", // 가로 중앙 정렬
    marginTop: 10, // 이미지와 로고 간 간격
  },
  socialIcon: {
    marginHorizontal: 15, // 로고 간 간격
  },  
  artistNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  artistName: {
    fontSize: 22, // 기존 크기 유지
    fontWeight: "bold",
    marginBottom: 4,
  },
  artistKrName: {
    fontSize: 16, // 크기를 살짝 줄임
    fontWeight: "normal", // bold 제거, regular로 설정
    color: "gray", // 약간의 시각적 구분을 위해 색상 변경 (옵션)
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
    width: "98%",
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
    marginLeft: 16,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    marginBottom: 16,
    marginLeft: 5,
    marginRight: 16,
    alignSelf: "stretch",
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
    marginLeft: 18,
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
    marginLeft: 16,
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
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    marginLeft: 16,
    marginBottom: 12,
  },

});

export default ArtistScreen;