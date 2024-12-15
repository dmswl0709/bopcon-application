import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const BoardScreen = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null); // 클릭된 게시글 상태
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
      Alert.alert("오류", "게시글 데이터를 불러올 수 없습니다.");
    }
  };

  const handleArticlePress = (article) => {
    console.log("선택된 게시글:", article);
    setSelectedArticle(article); // 상태에 선택된 게시글 저장
    setIsModalVisible(true); // 모달 열기
  };

  const closeModal = () => {
    setSelectedArticle(null); // 선택된 게시글 초기화
    setIsModalVisible(false); // 모달 닫기
  };

  return (
    <View style={styles.container}>
      {/* 게시글 목록 */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleArticlePress(item)} // 클릭 시 동작
            style={styles.articleContainer}
          >
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>게시글이 없습니다.</Text>}
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
                <Text style={styles.modalAuthor}>작성자: {selectedArticle.userName}</Text>
                <Text style={styles.modalBody}>{selectedArticle.content}</Text>
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
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BoardScreen;
