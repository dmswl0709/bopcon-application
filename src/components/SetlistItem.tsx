import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";

interface SetlistItemProps {
  index: number;
  songTitle: string;
  ytLink?: string | null;
  fetchLyrics: () => Promise<string>; // 가사를 불러오는 함수
  artistId: string;
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songTitle, fetchLyrics }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 토글 상태
  const [lyrics, setLyrics] = useState<string | null>(null); // 가사 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 토글 및 가사 불러오기
  const handleToggle = async () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded && !lyrics) {
      try {
        setLoading(true);
        const fetchedLyrics = await fetchLyrics();
        setLyrics(fetchedLyrics);
      } catch (error) {
        console.error("Error fetching lyrics:", error);
        setLyrics("가사를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.itemContainer}>
      {/* 상단 행 */}
      <View style={styles.container}>
        <Text style={styles.index}>{index < 10 ? `0${index}` : index}</Text>
        <Text style={styles.songName}>{songTitle}</Text>

        {/* 아이콘 */}
        <TouchableOpacity onPress={handleToggle} style={styles.iconContainer}>
          <Image
            source={require("../assets/icons/down.png")}
            style={[styles.icon, isExpanded && { transform: [{ rotate: "180deg" }] }]}
          />
        </TouchableOpacity>
      </View>

      {/* 가사 표시 */}
      {isExpanded && (
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
    marginBottom: 2,
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