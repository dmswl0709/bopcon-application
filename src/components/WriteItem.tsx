import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface WriteItemProps {
  title: string;
  content: string;
  nickname: string;
  artistName: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void; // 게시글 클릭 시 호출될 콜백
}

const WriteItem: React.FC<WriteItemProps> = ({
  title,
  content,
  nickname,
  artistName,
  onEdit,
  onDelete,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <Text style={styles.artistName}>아티스트: {artistName}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.actionButtonText}>수정</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.actionButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
  actionsContainer: {
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 10,
    marginLeft: 240,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#777',
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});

export default WriteItem;
