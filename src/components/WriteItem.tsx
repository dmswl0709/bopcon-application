import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface WriteItemProps {
  title: string;
  content: string;
  nickname: string;
  artistName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const WriteItem: React.FC<WriteItemProps> = ({
  title,
  content,
  nickname,
  artistName,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.artistName}>{artistName}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.footer}>{`작성자 | ${nickname}`}</Text>

      {/* 수정 및 삭제 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  content: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  footer: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#80B5E7",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ED9CA5",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default WriteItem;
