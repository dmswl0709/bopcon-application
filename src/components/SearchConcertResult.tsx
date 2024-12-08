import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchResult } from "../screens/SearchScreen";

interface SearchConcertResultProps {
  concerts: SearchResult[];
  query: string;
}

const SearchConcertResult: React.FC<SearchConcertResultProps> = ({ concerts, query }) => {
  const navigation = useNavigation();

  if (concerts.length === 0) {
    return <Text style={styles.noResultText}>‘{query}’에 대한 콘서트 검색결과 없음</Text>;
  }

  return (
    <FlatList
      data={concerts}
      keyExtractor={(item) => item.newConcertId.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => navigation.navigate("ConcertScreen", { concertId: item.newConcertId })}
        >
          <Image source={{ uri: item.posterUrl }} style={styles.image} />
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.details}>{item.date}</Text>
            <Text style={styles.details}>{item.venueName}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  image: { width: 50, height: 50, borderRadius: 4, marginRight: 16 },
  title: { fontSize: 16, fontWeight: "bold" },
  details: { fontSize: 14, color: "gray" },
  noResultText: { textAlign: "center", color: "gray", marginVertical: 16 },
});

export default SearchConcertResult;