import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface SetlistItemProps {
  index: number;
  songTitle: string;
  ytLink?: string | null; // YouTube 링크 추가
  fetchLyrics: () => Promise<string>; // 가사를 불러오는 함수
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songTitle, ytLink, fetchLyrics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

// 유튜브 링크에서 비디오 ID 추출 함수
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

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

  const videoId = ytLink ? extractYouTubeId(ytLink) : null;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.container}>
        <Text style={styles.index}>{index < 10 ? `0${index}` : index}</Text>
        <Text style={styles.songName}>{songTitle}</Text>

        <TouchableOpacity onPress={handleToggle} style={styles.iconContainer}>
          <Image
            source={require("../assets/icons/down.png")}
            style={[styles.icon, isExpanded && { transform: [{ rotate: "180deg" }] }]}
          />
        </TouchableOpacity>
      </View>

      {isExpanded && ytLink && (
        <View style={styles.youtubeContainer}>
          <YoutubePlayer
            height={200}
            play={false}
            videoId={videoId} // 비디오 ID 추출 후 전달
            onError={(e) => console.error("YouTube Player Error:", e)}
          />
        </View>
      )}

      {/* Lyrics */}
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
  youtubeContainer: {
    marginLeft: 40,
    marginRight: 16,
    marginBottom: 8,
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
    fontSize: 13,
    color: "#333",
    lineHeight: 13,
  },
});

export default SetlistItem;