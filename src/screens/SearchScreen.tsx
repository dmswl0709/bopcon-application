import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { fetchSearchResults } from "../apis/searchApi";
import NavigationView from "../components/NavigationView";
import SearchArtistResult from "../components/SearchArtistResult";
import SearchConcertResult from "../components/SearchConcertResult";

export interface SearchResult {
  newConcertId: number;
  title: string;
  subTitle: string;
  date: string;
  venueName: string;
  cityName: string;
  posterUrl: string;
  artistId: number;
  artistName: string;
  artistkrName: string;
  imgUrl: string;
  snsUrl: string;
  genre: string;
}

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState<SearchResult | null>(null);
  const [concerts, setConcerts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await fetchSearchResults(query.trim());
        if (data.length === 0) {
          setArtist(null);
          setConcerts([]);
        } else {
          const firstItem = data[0];
          const isArtistSearch = query
            .toLowerCase()
            .includes(firstItem.artistkrName.toLowerCase());

          if (isArtistSearch) {
            setArtist(firstItem);
            setConcerts(data.filter((item) => item.artistId === firstItem.artistId));
          } else {
            setArtist(null);
            setConcerts(data);
          }
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("검색 결과를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (hasSearched) {
      return (
        <>
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>아티스트</Text>
            <View style={styles.divider} />
            <SearchArtistResult artist={artist} query={query} />
          </View>
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>콘서트</Text>
            <View style={styles.divider} />
            <SearchConcertResult concerts={concerts} query={query} />
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <View style={styles.screenContainer}>
      <NavigationView>
        <FlatList
          data={[{ key: "results" }]} // Single key for rendering content
          renderItem={null} // Content is handled in ListHeaderComponent
          ListHeaderComponent={
            <View style={styles.container}>
              {/* 검색창 */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="검색어를 입력하세요"
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>검색</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          ListFooterComponent={renderContent} // Render results
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContent}
        />
      </NavigationView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white", // Set background color for the entire screen
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    width: Dimensions.get("window").width,
  },
  listContent: {
    paddingBottom: 16, // Add padding at the bottom
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
    maxWidth: Dimensions.get("window").width * 0.85, // 너비 85%
  },
  searchButton: {
    height: 50,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 3,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 16,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginVertical: 16,
  },
  resultSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default SearchScreen;