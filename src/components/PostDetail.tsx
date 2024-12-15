import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getCommentsByArticle, addComment } from "../apis/comments";

const PostDetail: React.FC = () => {
  const route = useRoute();
  const { post, token } = route.params;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    getCommentsByArticle(post.id)
      .then((data) => setComments(data))
      .catch((error) => {
        console.error("댓글 가져오기 실패:", error);
        Alert.alert("오류", "댓글을 가져오는 데 실패했습니다.");
      });
  }, [post.id]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const addedComment = await addComment(post.id, newComment.trim(), token);
        setComments((prev) => [addedComment, ...prev]); // 새 댓글을 위로 추가
        setNewComment("");
      } catch (error) {
        console.error("댓글 추가 실패:", error);
        Alert.alert("오류", "댓글 추가에 실패했습니다.");
      }
    } else {
      Alert.alert("알림", "댓글 내용을 입력해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>댓글</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{item.author}:</Text>
              <Text style={styles.commentContent}>{item.content}</Text>
            </View>
          )}
        />
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="댓글 작성"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.addButton}>
          <Text style={styles.addButtonText}>댓글 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  content: { fontSize: 16, marginBottom: 16 },
  commentSection: { marginTop: 16 },
  commentTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  commentItem: { marginBottom: 8, flexDirection: "row" },
  commentAuthor: { fontWeight: "bold", marginRight: 4 },
  commentContent: { flex: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginTop: 8 },
  addButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});

export default PostDetail;
