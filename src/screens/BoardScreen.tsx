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
  artistName: string;
  userName: string;
  concertTitle?: string;
  likeCount: number;
  commentCount: number;
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
  const userId = useSelector((state: any) => state.auth.userId);

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
        console.error("Error fetching artist data:", error);
        Alert.alert("Error", "Unable to fetch artist data.");
      }
    };

    fetchArtistData();
  }, [artistId]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      if (!artistId) return;

      try {
        const response = await axios.get(`${BASE_URL}/api/articles/artist/${artistId}`);
        setArticles(response.data.map((article: any) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          categoryType: article.categoryType,
          artistName: article.artistName || "Unknown Artist",
          userName: article.userName || "Anonymous",
          concertTitle: article.concertTitle || "",
          likeCount: article.likeCount || 0,
          commentCount: article.commentCount || 0,
        })));
      } catch (error) {
        console.error("Error fetching articles:", error);
        Alert.alert("Error", "Unable to fetch articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [artistId, isCreating, isEditing]);

  const handleDeleteArticle = async (articleId: number) => {
    if (!token) {
      Alert.alert("Error", "You need to log in to delete articles.");
      return;
    }

    Alert.alert("Confirmation", "Are you sure you want to delete this article?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/articles/${articleId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setArticles((prev) => prev.filter((article) => article.id !== articleId));
            setSelectedArticle(null);
            Alert.alert("Success", "Article deleted successfully.");
          } catch (error) {
            console.error("Error deleting article:", error);
            Alert.alert("Error", "Unable to delete article.");
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
    token: string,
    userId: number
  ) => {
    if (!token || !userId) {
      Alert.alert("Error", "You need to log in to create articles.");
      return;
    }

    const requestData = {
      title,
      content,
      categoryType,
      artistId,
      newConcertId,
      userId,
    };

    try {
      await axios.post(`${BASE_URL}/api/articles`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsCreating(false);
      Alert.alert("Success", "Article created successfully.");
    } catch (error) {
      console.error("Error creating article:", error);
      Alert.alert("Error", "Unable to create article.");
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
      Alert.alert("Error", "You need to log in to edit articles.");
      return;
    }

    const requestData = {
      title,
      content,
      categoryType,
      newConcertId,
    };

    try {
      await axios.put(`${BASE_URL}/api/articles/${id}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setSelectedArticle(null);
      Alert.alert("Success", "Article edited successfully.");
    } catch (error) {
      console.error("Error editing article:", error);
      Alert.alert("Error", "Unable to edit article.");
    }
  };

  const handleCreateButtonPress = () => {
    if (!token) {
      Alert.alert("Login Required", "You need to log in to create an article.", [
        {
          text: "Log in",
          onPress: () => navigation.navigate("LoginScreen"),
        },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loaderText}>Loading...</Text>
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
          fixedArtistId={artistId ? parseInt(artistId, 10) : null}
          token={token || ""}
          userId={userId || 0}
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
          token={token || ""}
          userId={userId || 0}
          onSubmit={handleEditSubmit}
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
                nickname={item.userName}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No articles available.</Text>
          }
        />
      )}

      {!isCreating && !isEditing && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateButtonPress}
        >
          <Text style={styles.createButtonText}>Create Article</Text>
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
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  artistName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  artistSubName: {
    fontSize: 16,
    color: "#d1e7ff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});

export default BoardScreen;
