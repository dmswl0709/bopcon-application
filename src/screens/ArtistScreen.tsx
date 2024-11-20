import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import FavoriteButton from "../components/FavoriteButton";
import ConcertRow from "../components/ConcertRow";

const ArtistScreen = ({ route, navigation }) => {
  const {
    artistName = "Artist Name",
    artistDetail = "This is a brief artist detail or bio.",
    instagramUrl = "https://instagram.com",
    spotifyUrl = "https://spotify.com",
  } = route.params || {};

  const [activeTab, setActiveTab] = useState("곡 랭킹");

  // 내한 예정 임시 데이터
  const upcomingConcert = {
    dateYear: "2025",
    dateDay: "01/12",
    description: "벤슨 분 첫 단독 내한 공연",
  };


  // 곡 랭킹 임시 데이터
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

  // 지난 공연 임시 데이터
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
  const [visibleConcerts, setVisibleConcerts] = useState(
    tempConcertData.slice(0, 3)
  );

  // 게시판 임시 데이터
  const tempBoardData = [
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ\n내용 미리보기 내용 미리보기 내용 미리보기",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ\n내용 미리보기 내용 미리보기 내용 미리보기",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
    {
      title: "벤슨 분 첫 단독 내한 공연",
      content: "와 정말 기대돼요. ㅎㅎ\n내용 미리보기 내용 미리보기 내용 미리보기",
      date: "2024/09/09 16:00",
      nickname: "닉네임",
    },
  ];

  // 곡 랭킹 렌더링
  const renderRankingContent = () => (
    <View>
      <Text style={styles.sectionTitle}>곡 랭킹 (최근 20개 콘서트 기준)</Text>
      <View style={styles.divider} />
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
            <TouchableOpacity>
              <Text style={styles.rankDetail}>∨</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {visibleSongs.length < tempSongData.length && (
        <TouchableOpacity onPress={() => setVisibleSongs(tempSongData)}>
          <Text style={styles.moreButton}>더보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // 지난 공연 렌더링
  const renderPastConcertContent = () => (
    <View>
      <Text style={styles.sectionTitle}>지난 공연 셋리스트</Text>
      <View style={styles.divider} />
      <FlatList
        data={visibleConcerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ConcertRow
            dateYear={item.dateYear}
            dateDay={item.dateDay}
            description={item.description}
            onPress={() => console.log('Navigate to ${item.description}')}
          />
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

  // 게시판 렌더링
  const renderBoardContent = () => (
    <View>
      <View style={styles.boardHeader}>
        <Text style={styles.sectionTitle}>게시판</Text>
        <TouchableOpacity onPress={() => navigation.navigate("BoardScreen")}>
          <Text style={styles.moreButtonGray}>더보기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
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

  // 탭별 렌더링
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
    <View style={styles.container}>
      <Header title="Artist" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Artist Info Section */}
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

        {/* Artist Name and Favorite */}
        <View style={styles.artistNameRow}>
          <View style={styles.artistNameContainer}>
            <Text style={styles.artistName}>{artistName}</Text>
            <Text style={styles.artistDetail}>{artistDetail}</Text>
          </View>
          <FavoriteButton />
        </View>


        {/* 내한 예정 */}
        <Text style={styles.upcomingTitle}>내한 예정</Text>
        <View style={styles.divider} />
        <ConcertRow
          dateYear={upcomingConcert.dateYear}
          dateDay={upcomingConcert.dateDay}
          description={upcomingConcert.description}
        />

        {/* Tabs */}
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

        {/* Dynamic Content */}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    content: { padding: 16 },
    artistInfoSection: { flexDirection: "row", marginBottom: 16 },
    artistImage: { width: 160, height: 160, resizeMode: "contain" },
    socialMediaContainer: { marginLeft: 22 },
    socialIcon: { width: 50, height: 50, marginBottom: 9 },
    artistNameRow: { flexDirection: "row", justifyContent: "space-between" },
    artistNameContainer: { flex: 1 },
    artistName: {
      fontSize: 22,
      fontWeight: "bold",
      fontFamily: "Pretendard-Bold",
      marginTop: 8,
    },
    artistDetail: {
      fontSize: 14,
      color: "gray",
      fontFamily: "Pretendard-Regular",
      marginTop: 4,
      marginBottom:30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "Pretendard-Bold",
      marginBottom: 8,
      marginTop: 8,
    },
    divider: {
      borderBottomWidth: 2,
      borderBottomColor: "black",
      marginBottom: 16,
    },
    tabRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      marginBottom: 16,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "lightgray",
    },
    activeTabButton: {
      borderBottomColor: "black",
    },
    tabText: {
      fontSize: 14,
      color: "gray",
      fontFamily: "Pretendard-Bold",
    },
    activeTabText: {
      color: "black",
    },
    rankRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    rankNumber: {
      width: 32,
      textAlign: "center",
      fontWeight: "bold",
      marginRight: 8,
    },
    firstRank: { backgroundColor: "yellow", borderRadius: 4 },
    secondRank: { backgroundColor: "lightgray", borderRadius: 4 },
    thirdRank: { backgroundColor: "gold", borderRadius: 4 },
    rankSong: { flex: 1 },
    rankDetail: { color: "gray" },
    moreButton: {
      textAlign: "center",
      color: "gray",
      marginTop: 16,
      fontFamily: "Pretendard-Bold",
    },
    lightDivider: {
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      marginBottom: 16,
    },
    boardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    boardRow: {
      marginBottom: 16,
    },
    boardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
      fontFamily: "Pretendard-Bold",
    },
    boardContent: {
      fontSize: 14,
      color: "gray",
      marginBottom: 4,
      fontFamily: "Pretendard-Regular",
    },
    boardDate: {
      fontSize: 12,
      color: "gray",
      fontFamily: "Pretendard-Regular",
    },
    moreButtonGray: {
      fontSize: 14,
      color: "lightgray",
      fontFamily: "Pretendard-Bold",
    },
  });

export default ArtistScreen;