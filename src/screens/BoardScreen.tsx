import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
} from "react-native";
import axios from "axios";

const BASE_URL = "https://api.bopcon.site";

const BoardScreen = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  // 게시글 불러오기
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
      Alert.alert("오류", "게시글 데이터를 불러올 수 없습니다.");
    }
  };

  // 댓글 불러오기
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글 데이터를 불러오는 중 오류 발생:", error);
      Alert.alert("오류", "댓글 데이터를 불러올 수 없습니다.");
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/comments`, {
        postId: selectedArticle.id,
        content: newComment,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
    }
  };

  // 게시글 클릭 시 모달 열기
  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
    fetchComments(article.id);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalVisible(false);
    setComments([]);
  };

  return (
    <View style={styles.container}>
      {/* 게시글 목록 */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleArticlePress(item)}
            style={styles.articleContainer}
          >
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleContent} numberOfLines={2}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>게시글이 없습니다.</Text>
        }
      />

      {/* 선택된 게시글 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedArticle && (
              <>
                <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
                <Text style={styles.modalAuthor}>
                  작성자: {selectedArticle.userName}
                </Text>
                <Text style={styles.modalBody}>{selectedArticle.content}</Text>

                {/* 댓글 섹션 */}
                <Text style={styles.commentTitle}>댓글</Text>
                {comments.length > 0 ? (
                  <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Text style={styles.commentItem}>{item.content}</Text>
                    )}
                  />
                ) : (
                  <Text style={styles.noComments}>댓글이 없습니다.</Text>
                )}

                {/* 댓글 입력 */}
                <TextInput
                  style={styles.commentInput}
                  placeholder="댓글 작성..."
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <Button title="댓글 추가" onPress={handleAddComment} />
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  articleContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  articleContent: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  noComments: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  commentInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BoardScreen;
