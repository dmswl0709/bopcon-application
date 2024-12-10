import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArticleForm from "../components/ArticleForm";
import ArticleModal from "../components/ArticleModal";
import WriteItem from "../components/WriteItem";
import BackNavigationBar from "../components/BackNavigationBar";
import GlobalList from "../components/GlobalList";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  content: string;
  categoryType: "FREE_BOARD" | "NEW_CONCERT";
  newConcert?: { id: number };
  userId: number; // userId 수정
}

interface ArtistData {
  artistId: number;
  name: string;
  krName: string;
  imgUrl: string;
}

const BASE_URL = "http://localhost:8080";

const BoardScreen: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = useSelector((state: any) => state.auth.token);
  const userId: number | null = useSelector((state: any) => state.auth.userId);

  const navigation = useNavigation();
  const route = useRoute();
  const { artistId } = route.params as { artistId: string };

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId) return;

      try {
        const response = await axios.get(`${BASE_URL}/api/artists/${artistId}`);
        setArtistData(response.data);
      } catch (error) {
        console.error("아티스트 데이터를 불러오는 중 오류 발생:", error);
        Alert.alert("오류", "아티스트 데이터를 불러올 수 없습니다.");
      }
    };

    fetchArtistData();
  }, [artistId]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/articles/artist/${artistId}`
        );
        setArticles(response.data);
      } catch (error) {
        console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
        Alert.alert("오류", "게시글 데이터를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [artistId, isCreating, isEditing]);

  const handleDeleteArticle = async (id: number) => {
    if (!token) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    Alert.alert("확인", "정말로 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/articles/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setArticles((prev) => prev.filter((article) => article.id !== id));
            setSelectedArticle(null);
            Alert.alert("성공", "게시글이 삭제되었습니다.");
          } catch (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            Alert.alert("오류", "게시글 삭제에 실패했습니다.");
          }
        },
      },
    ]);
  };

  const handleCreateSubmit = async (
    title: string,
    content: string,
    categoryType: "FREE_BOARD" | "NEW_CONCERT",
    artistId: number | null,
    newConcertId: number | null,
    userId: number | null
  ) => {
    if (!token || userId === null) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    const requestData = {
      title,
      content,
      categoryType,
      artistId: artistId ?? 0,
      newConcertId: categoryType === "NEW_CONCERT" ? newConcertId : null,
      userId,
    };

    console.log("요청 데이터:", requestData);

    try {
      await axios.post(`${BASE_URL}/api/articles`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsCreating(false);
      Alert.alert("성공", "게시글이 작성되었습니다.");
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      Alert.alert("오류", "게시글 작성에 실패했습니다.");
    }
  };

  const handleEditSubmit = async (
    id: number,
    title: string,
    content: string,
    categoryType: "FREE_BOARD" | "NEW_CONCERT",
    newConcertId: number | null
  ) => {
    if (!token) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    const requestData = {
      title,
      content,
      categoryType,
      newConcertId,
    };

    console.log("요청 데이터:", requestData);

    try {
      await axios.put(`${BASE_URL}/api/articles/${id}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setSelectedArticle(null);
      Alert.alert("성공", "게시글이 수정되었습니다.");
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      Alert.alert("오류", "게시글 수정에 실패했습니다.");
    }
  };

  const handleCreateButtonPress = () => {
    if (!token) {
      Alert.alert("로그인이 필요합니다.", "로그인 페이지로 이동합니다.", [
        {
          text: "확인",
          onPress: () => navigation.navigate("LoginScreen"),
        },
        { text: "취소", style: "cancel" },
      ]);
      return;
    }
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackNavigationBar />
      {artistData && (
        <View style={styles.header}>
          <Text style={styles.artistName}>{artistData.krName}</Text>
          <Text style={styles.artistSubName}>{artistData.name}</Text>
        </View>
      )}
      <GlobalList title="게시판" />

      {isCreating ? (
        <ArticleForm
          mode="create"
          fixedArtistId={parseInt(artistId || "0", 10)}
          userId={userId} // userId 전달
          token={token} // token 전달
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreating(false)}
        />
      ) : isEditing && selectedArticle ? (
        <ArticleForm
          mode="edit"
          initialTitle={selectedArticle.title}
          initialContent={selectedArticle.content}
          initialCategoryType={selectedArticle.categoryType}
          fixedArtistId={parseInt(artistId || "0", 10)}
          onSubmit={(title, content, categoryType, newConcertId) =>
            handleEditSubmit(
              selectedArticle.id,
              title,
              content,
              categoryType,
              newConcertId
            )
          }
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedArticle(item)}>
              <WriteItem
                title={item.title}
                content={item.content}
                nickname={item.userId} // userId를 표시
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>게시글이 없습니다.</Text>
          }
        />
      )}

      {!isCreating && !isEditing && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateButtonPress}
        >
          <Text style={styles.createButtonText}>글쓰기</Text>
        </TouchableOpacity>
      )}

      {selectedArticle && !isEditing && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteArticle(selectedArticle.id)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  artistName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  artistSubName: {
    fontSize: 16,
    color: "gray",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#000",
    padding: 12,
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
});

export default BoardScreen;
