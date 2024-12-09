import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton"; // 즐겨찾기 버튼 임포트
import ConcertRow from "../components/ConcertRow";
import { SafeAreaView } from "react-native";
import InstagramLogo from "../assets/icons/InstagramLogo.svg";
import SpotifyLogo from "../assets/icons/SpotifyLogo.svg";
import { fetchUpcomingConcerts, fetchSongRanking, fetchPastConcerts} from "../apis/concerts";
import ArticleForm from "../components/ArticleForm";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { Linking } from "react-native";

interface WriteItemProps {
  title: string;
  content: string;
  date?: string;
  nickname?: string;
  artistName?: string;
}


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
  const [isCreating, setIsCreating] = useState(false); // isCreating 상태 추가
  const [boardArticles, setBoardArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); // 초기화




  const WriteItem: React.FC<WriteItemProps> = ({ title, content, date, nickname, artistName }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.meta}>
          {date} · {nickname} · {artistName}
        </Text>
      </View>
    );
  };
  

  const fetchBoardArticles = async () => {
    try {
      const response = await axios.get(`/api/articles/artist/${artistId}`);
      setBoardArticles(response.data);
    } catch (error) {
      console.error('게시글 데이터를 불러오는 중 오류 발생:', error);
      Alert.alert('오류', '게시글 데이터를 불러올 수 없습니다.');
    }
  };
  

  useEffect(() => {
    fetchBoardArticles();
  }, []);

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
        const artistId = artistData?.artistId;

        if (!artistId) {
          console.error("artistId가 없습니다. 곡 랭킹을 불러올 수 없습니다.");
          return;
        }

        console.log(`Fetching song rankings for artistId: ${artistId}`);
        const response = await axios.get(`http://localhost:8080/api/artists/${artistId}/song-ranking`);
        console.log("Fetched song rankings:", response.data);

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
    const sortedSongs = visibleSongs
      .sort((a, b) => b.count - a.count) // count 기준으로 내림차순 정렬
      .slice(0, 20); // 상위 20개 선택

    return (
      <View>
        <Text style={styles.sectionTitle}>최근 20개 콘서트 기준</Text>
        {sortedSongs.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 16 }}>곡 데이터가 없습니다.</Text>
        ) : (
          <FlatList
            data={sortedSongs}
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

  const renderUpcomingConcerts = () => (
    <View>
      {upcomingConcerts.length > 0 ? (
        upcomingConcerts.map((concert, index) => {
          const formatWithDot = (dateArray) => {
            if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
            const [year, month, day] = dateArray;
            return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
          };

          const startDay = formatWithDot(concert.startDate);
          const endDay = formatWithDot(concert.endDate);
          const displayDate = startDay === endDay ? startDay : `${startDay} ~ ${endDay}`;

          console.log("ConcertRow Props:", {
            startDay,
            endDay,
            description: concert.title,
          });

          return (
            <ConcertRow
              key={index}
              startDay={startDay}
              endDay={endDay}
              description={concert.title || "No title"}
              onPress={() =>
                navigation.navigate("ConcertScreen", {
                  concertDetails: { ...concert, startDay, endDay },
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

  // 렌더링할 콘텐츠
  const renderBoardContent = () => {
    if (isCreating) {
      // 글쓰기 모드
      return (
        <ArticleForm
          mode="create"
          fixedArtistId={artistId}
          onSubmit={handleCreateArticle} // 글쓰기 완료 시 호출
          onCancel={() => setIsCreating(false)} // 취소 시 글쓰기 모드 종료
        />
      );
    }
  
    return (
      <View style={styles.container}>
        <FlatList
  data={articles}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => setSelectedArticle(item)}>
      <WriteItem
        title={item.title}
        content={item.content}
        date={item.date || "날짜 없음"}
        nickname={item.userName || "익명"}
        artistName={item.artistName || ""}
      />
    </TouchableOpacity>
  )}
  ListEmptyComponent={
    <Text style={styles.emptyText}>게시글이 없습니다.</Text>
  }
/>

        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => setIsCreating(true)}
        >
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "곡 랭킹":
        return renderRankingContent();
      case "지난 공연":
        return renderPastConcertContent();
      case "게시판":
        return renderBoardContent(); // 게시판 렌더링 함수 추가
      default:
        return null;
    }
  };

  
  const handleCreateArticle = async (
    title: string,
    content: string,
    categoryType: "FREE_BOARD" | "NEW_CONCERT",
    artistId: number | null,
    newConcertId: number | null
  ) => {
    if (!token) {
      Alert.alert("로그인이 필요합니다.", "로그인 페이지로 이동합니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("LoginScreen"), // 로그인 화면으로 이동
        },
        { text: "취소", style: "cancel" },
      ]);
      return;
    }
  
    try {
      const requestData = {
        title,
        content,
        categoryType,
        artistId,
        userId, // Redux에서 가져온 사용자 ID
        newConcertId: categoryType === "NEW_CONCERT" ? newConcertId : null,
      };
  
      const response = await axios.post("/api/articles", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      Alert.alert("성공", "게시글이 작성되었습니다.");
      setIsCreating(false);
      fetchBoardArticles(); // 게시글 목록 새로고침
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      Alert.alert("오류", "게시글 작성에 실패했습니다.");
    }
  };
  
  

  // 지난 공연 데이터를 로드
  useEffect(() => {
    const loadPastConcerts = async () => {
      try {
        if (!artistId) {
          console.error("artistId가 없습니다. API 요청을 중단합니다.");
          return;
        }
    
        const response = await axios.get(`http://localhost:8080/api/artists/${artistId}/past-concerts`);
        console.log("Past concerts response:", response.data); // 응답 데이터 확인
    
        if (Array.isArray(response.data)) {
          setPastConcerts(response.data);
        } else {
          console.error("API 응답이 배열 형태가 아닙니다. 빈 배열로 설정합니다.");
          setPastConcerts([]);
        }
      } catch (error) {
        console.error("과거 콘서트를 불러오는 중 오류 발생:", error);
      }
    };

    if (artistData) {
      loadPastConcerts();
    }
  }, [artistData]);

  const renderPastConcertContent = () => (
    <View style={{ paddingHorizontal: 16 }}>
    {pastConcerts.length > 0 ? (
      pastConcerts.map((concert, index) => {
        const formatWithDot = (dateArray) => {
          if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
          const [year, month, day] = dateArray;
          return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
        };

        const startDay = formatWithDot(concert.startDate || concert.date);
        const endDay = formatWithDot(concert.endDate || concert.date);

        // `concert.date`에서 `year`, `month`, `day`를 안전하게 추출
        const year = concert.date?.[0];
        const month = concert.date?.[1];
        const day = concert.date?.[2];
        
        // 날짜가 없을 경우 로그를 남기고 해당 항목을 렌더링하지 않음
        if (!year || !month || !day) {
          console.warn("Invalid date format for concert:", concert);
          return null;
         }

          return (
            <ConcertRow
              key={concert.pastConcertId}
              startDay={startDay}
              endDay={endDay}
              description={concert.title || `${concert.venueName || ""}, ${concert.cityName || ""}` || "공연 제목 없음"}
              onPress={() =>
                navigation.navigate("SetListScreen", {
                  artistId, // 현재 아티스트 ID 전달
                  pastConcertId: concert.pastConcertId, // 선택한 공연 ID 전달
                  title: concert.title || "Unknown Concert", // 제목 전달
                  venueName: concert.venueName || "Unknown Venue", // 공연장 정보 전달
                  cityName: concert.cityName || "Unknown City", // 도시 정보 전달
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
              {/* 즐겨찾기 버튼 추가 */}
              <FavoriteButton id={artistId} type="artist" />
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
 
  

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  writeButton: {
    backgroundColor: "#000",
    padding: 12,
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 8,
  },
  writeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
  
});

export default ArtistScreen;