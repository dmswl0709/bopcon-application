import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SetlistItemProps {
  index: number;
  songTitle: string; 
  ytLink?: string | null;
}

const SetlistItem: React.FC<SetlistItemProps> = ({ index, songTitle, ytLink }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.index}>
        {index < 10 ? `0${index}` : index} {/* Zero-padded index */}
      </Text>
      <Text style={styles.songName}>{songTitle}</Text>
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
  linkText: {
    fontSize: 14,
    color: "blue",
  },
});

export default SetlistItem;