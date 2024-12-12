import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface WriteItemProps {
  title: string;
  content: string;
  nickname: string;
  onPress?: () => void;
}

const WriteItem: React.FC<WriteItemProps> = ({ title, content, nickname, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{`작성자 | ${nickname}`}</Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eeeeee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#999999",
    textAlign: "right",
  },
});


export default WriteItem;
