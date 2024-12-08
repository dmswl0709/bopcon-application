import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchResult } from "../screens/SearchScreen";

interface SearchArtistResultProps {
  artist: SearchResult | null;
  query: string;
}

const SearchArtistResult: React.FC<SearchArtistResultProps> = ({ artist, query }) => {
  const navigation = useNavigation();

  if (!artist) {
    return <Text style={styles.noResultText}>‘{query}’에 대한 아티스트 검색결과 없음</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("ArtistScreen", { artistId: artist.artistId })}>
        <Image source={{ uri: artist.imgUrl }} style={styles.image} />
      </TouchableOpacity>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("ArtistScreen", { artistId: artist.artistId })}>
          <Text style={styles.artistName}>{artist.artistkrName}</Text>
        </TouchableOpacity>
        <Text style={styles.artistDetails}>{artist.artistName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  artistName: { fontSize: 16, fontWeight: "bold" },
  artistDetails: { fontSize: 14, color: "gray" },
  noResultText: { textAlign: "center", color: "gray", marginVertical: 16 },
});

export default SearchArtistResult;