import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
}

const SearchInput = ({ query, setQuery, onSearch }) => {
    return (
      <View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearch}
          placeholder="검색어를 입력하세요"
        />
        <Button title="검색" onPress={onSearch} />
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8, marginRight: 8 },
});

export default SearchInput;