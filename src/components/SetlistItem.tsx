import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SetlistItemProps {
  index: number; // Order of the song
  songName: string; // Song title
  ytLink?: string | null; // Optional YouTube link
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songName, ytLink }) => {
  return (
    <View style={styles.container}>
      {/* Display the order of the song */}
      <Text style={styles.index}>
        {index < 10 ? `0${index}` : index} {/* Zero-padded index */}
      </Text>
      {/* Display the song title */}
      <Text style={styles.songName}>{songName}</Text>
      {/* Display YouTube link indicator if available */}
      {ytLink && <Text style={styles.linkText}>YouTube Link Available</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    // Removed the divider styles
    // borderBottomWidth: 1,
    // borderBottomColor: "#E0E0E0",
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
    fontFamily: "Pretendard-Regular",
    color: "black",
    flex: 1,
  },
  linkText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "blue",
  },
});

export default SetlistItem;
