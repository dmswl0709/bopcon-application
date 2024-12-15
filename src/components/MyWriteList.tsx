import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import WriteItem from "./WriteItem";
import ArticleForm from "./ArticleForm";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ArticleData {
  id: number;
  artist_id: number;
  title: string;
  content: string;
  categoryType: string;
  created_at: string;
  updated_at?: string;
  userName: string;
  artistName: string;
}

interface MyWriteListProps {
  isExpanded: boolean;
}

const MyWriteList: React.FC<MyWriteListProps> = ({ isExpanded }) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const userToken = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user);

  // 게시글 가져오기
  useEffect(() => {
    const fetchArticles = async () => {
      if (!userToken) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/articles/user", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setArticles(response.data);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [userToken]);

  // 게시글 수정
  const handleUpdateArticle = async (
    title: string,
    content: string,
    categoryType: string,
    concertId: number
  ) => {
    if (!selectedArticle) return;
  
    if (!userToken) {
      Alert.alert("오류", "로그인이 필요합니다. 다시 로그인해주세요.");
      return;
    }
  
    try {
      const updatedArticle = {
        title,
        content,
        categoryType,
        newConcertId: concertId,
      };
  
      const response = await axios.put(
        `http://localhost:8080/api/articles/${selectedArticle.id}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  
      // 상태 업데이트
      setArticles((prev) =>
        prev.map((a) =>
          a.id === selectedArticle.id ? { ...a, ...response.data } : a
        )
      );
  
      setIsEditing(false);
      setSelectedArticle(null);
      Alert.alert("성공", "게시글이 수정되었습니다.");
    } catch (err) {
      console.error("게시글 수정 오류:", err.response?.data || err.message);
      Alert.alert("오류", "게시글 수정에 실패했습니다.");
    }
  };
  
  

  // 게시글 삭제
  const handleDelete = async (article: ArticleData) => {
    Alert.alert("확인", "정말로 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            await axios.delete(`http://localhost:8080/api/articles/${article.id}`, {
              headers: { Authorization: `Bearer ${userToken}` },
            });
            setArticles((prev) =>
              prev.filter((a) => a.id !== article.id)
            );
            Alert.alert("성공", "게시글이 삭제되었습니다.");
          } catch (err) {
            Alert.alert("오류", "게시글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  // 수정 시작
  const handleEdit = (article: ArticleData) => {
    setSelectedArticle(article);
    setIsEditing(true);
  };

  if (loading) return <ActivityIndicator style={styles.centered} size="large" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
     <FlatList
  data={isExpanded ? articles : articles.slice(0, 2)}
  keyExtractor={(item, index) =>
    item?.id?.toString() || `fallback-key-${index}`
  }
  renderItem={({ item }) => (
    <WriteItem
      title={item.title}
      content={item.content}
      nickname={item.userName || "익명"}
      artistName={`아티스트: ${item.artistName || "정보 없음"}`}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
    />
  )}
/>


      {/* 수정 폼 */}
      {isEditing && selectedArticle && (
        <Modal visible={isEditing} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ArticleForm
                mode="edit"
                initialTitle={selectedArticle.title}
                initialContent={selectedArticle.content}
                initialCategoryType={selectedArticle.categoryType}
                fixedArtistId={selectedArticle.artist_id}
                token={userToken}
                userId={userId}
                onSubmit={handleUpdateArticle}
                onCancel={() => {
                  setIsEditing(false);
                  setSelectedArticle(null);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
});

export default MyWriteList;
