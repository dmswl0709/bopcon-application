import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";

interface SetlistItemProps {
  index: number;
  songTitle: string;
  ytLink?: string | null;
  artistId: string; // 아티스트 ID를 추가로 받음
  hideIcon?: boolean; // 아이콘 숨김 여부 설정
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songTitle, ytLink, artistId, hideIcon = false }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 토글 상태
  const [lyrics, setLyrics] = useState<string | null>(null); // 가사 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 가사 불러오는 함수
  const fetchLyrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.bopcon.site/api/artists/${artistId}/past-concerts`);
      const foundSong = response.data
        .flatMap((concert: any) => concert.setlists) // 모든 setlists를 평탄화
        .find((item: any) => item.song?.title === songTitle);

      if (foundSong?.song?.lyrics) {
        setLyrics(foundSong.song.lyrics);
      } else {
        setLyrics("가사 정보가 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("가사를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded && lyrics === null) {
      fetchLyrics();
    }
  };

  return (
    <View style={styles.itemContainer}>
      {/* 상단 행 */}
      <View style={styles.container}>
        <Text style={styles.index}>
          {index < 10 ? `0${index}` : index}
        </Text>

        {/* 곡 제목 */}
        <Text style={styles.songName}>{songTitle}</Text>

        {/* down 아이콘 - hideIcon이 true면 렌더링하지 않음 */}
        {!hideIcon && (
          <TouchableOpacity onPress={handleToggle} style={styles.iconContainer}>
            <Image
              source={require("../assets/icons/down.png")}
              style={[
                styles.icon,
                isExpanded && { transform: [{ rotate: "180deg" }] }, // 회전 적용
              ]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 토글된 가사 표시 영역 */}
      {!hideIcon && isExpanded && (
        <View style={styles.lyricsContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <ScrollView style={styles.scrollView}>
              {lyrics?.split("\n").map((line, idx) => (
                <Text key={idx} style={styles.lyricsText}>
                  {line}
                </Text>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 2, // 각 항목 간 여백
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    width: 40,
    textAlign: "center",
  },
  songName: {
    fontSize: 16,
    color: "black",
    flex: 1,
  },
  iconContainer: {
    paddingHorizontal: 8,
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  lyricsContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    marginLeft: 40,
    marginRight: 16,
    padding: 8,
    maxHeight: 150,
  },
  scrollView: {
    flexGrow: 1,
  },
  lyricsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});

export default SetlistItem;