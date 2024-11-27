import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import axios from "axios";

interface Song {
  order: number; // The position of the song in the setlist
  title: string; // Song title
  songId: number; // Unique ID for the song
  ytLink: string | null; // Optional YouTube link
}

interface SetlistProps {
  artistId: string; // The artist ID used to fetch the setlist
}

const SetlistItem: React.FC<SetlistProps> = ({ artistId }) => {
  const [setlist, setSetlist] = useState<Song[]>([]); // State for the setlist data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // API call to fetch the predicted setlist
  const fetchSetlist = async () => {
    if (!artistId) {
      setError("Artist ID is missing. Cannot fetch setlist.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.get<Song[]>(
        `http://localhost:8080/api/setlists/predict/artist/${artistId}` // API endpoint
      );
      console.log("Fetched setlist data:", response.data);

      if (Array.isArray(response.data)) {
        setSetlist(response.data); // Update state with the fetched data
        setError(null); // Clear any previous errors
      } else {
        setError("Invalid data format received from the server."); // Handle unexpected response structure
      }
    } catch (err: any) {
      console.error("Error fetching setlist:", err.message);
      setError("Failed to fetch setlist. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchSetlist();
  }, [artistId]); // Re-run the effect when artistId changes

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading setlist...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  // Show empty state when no songs are available
  if (setlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No setlist available.</Text>
      </View>
    );
  }

  // Render the setlist using FlatList
  return (
    <FlatList
      data={setlist}
      keyExtractor={(item) => `setlist-item-${item.songId}`} // Use songId as the unique key
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Text style={styles.index}>
            {item.order  < 10 ? `0${item.order}` : item.order } {/* Zero-padded index */}
          </Text>
          <Text style={styles.songName}>{item.title}</Text> {/* Map `title` to songName */}
          {item.ytLink && (
            <Text style={styles.linkText}>YouTube Link Available</Text> // YouTube link indicator
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    color: "blue", // Link style
  },
});

export default SetlistItem;