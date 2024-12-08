import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RootState } from '../store';
import WriteItem from '../components/WriteItem';
import ArticleModal from '../components/ArticleModal';
import ArticleForm from '../components/ArticleForm';
import GlobalList from '../components/GlobalList';
import BackNavigationBar from '../components/BackNavigationBar';
import GlobalSingerHeader from '../components/GlobalSingerHeader';
import SingerDetailImg from '../singer-detail-img';

const BoardScreen: React.FC = () => {
  const [articles, setArticles] = useState([]);
  const [artistData, setArtistData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const route = useRoute();
  const { artistId } = route.params;

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(`/api/artists/${artistId}`);
        setArtistData(response.data);
      } catch (error) {
        console.error('Failed to fetch artist data:', error);
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`/api/articles/artist/${artistId}`);
        setArticles(response.data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    fetchArtistData();
    fetchArticles();
  }, [artistId, isCreating, isEditing]);

  const handleDeleteArticle = async (id: number) => {
    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    Alert.alert('삭제 확인', '정말로 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: async () => {
          try {
            await axios.delete(`/api/articles/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setArticles((prev) => prev.filter((article) => article.id !== id));
            setSelectedArticle(null);
            Alert.alert('성공', '게시글이 삭제되었습니다.');
          } catch (error) {
            console.error('Failed to delete article:', error);
            Alert.alert('오류', '게시글 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleCreateSubmit = async (
    title: string,
    content: string,
    categoryType: 'FREE_BOARD' | 'NEW_CONCERT',
    artistId: number | null,
    newConcertId: number | null
  ) => {
    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(
        '/api/articles',
        { title, content, categoryType, artistId: artistId ?? 0, newConcertId: newConcertId ?? 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsCreating(false);
      Alert.alert('성공', '게시글이 작성되었습니다.');
    } catch (error) {
      console.error('Failed to create article:', error);
      Alert.alert('오류', '게시글 작성에 실패했습니다.');
    }
  };

  const handleEditSubmit = async (
    id: number,
    title: string,
    content: string,
    categoryType: 'FREE_BOARD' | 'NEW_CONCERT',
    newConcertId: number | null
  ) => {
    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    try {
      await axios.put(
        `/api/articles/${id}`,
        { title, content, categoryType, newConcertId: newConcertId ?? 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      setSelectedArticle(null);
      Alert.alert('성공', '게시글이 수정되었습니다.');
    } catch (error) {
      console.error('Failed to edit article:', error);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <BackNavigationBar />

      {artistData && (
        <>
          <SingerDetailImg Img={artistData.imgUrl} />
          <GlobalSingerHeader
            krName={artistData.name}
            engName={artistData.krName}
            likeId={artistData.artistId}
          />
        </>
      )}

      <GlobalList title="게시판" />

      {isCreating ? (
        <ArticleForm
          mode="create"
          fixedArtistId={parseInt(artistId, 10)}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreating(false)}
        />
      ) : isEditing && selectedArticle ? (
        <ArticleForm
          mode="edit"
          initialTitle={selectedArticle.title}
          initialContent={selectedArticle.content}
          initialCategoryType={selectedArticle.categoryType}
          fixedArtistId={parseInt(artistId, 10)}
          initialNewConcertId={selectedArticle.newConcert?.id || null}
          onSubmit={(title, content, categoryType, artistId, newConcertId) =>
            handleEditSubmit(selectedArticle.id, title, content, categoryType, newConcertId)
          }
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <View style={styles.articleList}>
          {articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              onPress={() => setSelectedArticle(article)}
              style={styles.articleItem}
            >
              <WriteItem
                title={article.title}
                content={article.content}
                date={article.created_at}
                nickname={article.userName || '익명'}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!isCreating && !isEditing && (
        <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  articleList: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  articleItem: {
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    margin: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BoardScreen;