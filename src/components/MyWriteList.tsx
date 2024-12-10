import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  FlatList, 
  Alert 
} from 'react-native';
import axios from 'axios';
import WriteItem from './WriteItem';
import ArticleModal from './ArticleModal';
import ArticleForm from './ArticleForm';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ArticleData {
  post_id: number;
  artist_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  userName: string;
}

interface MyWriteListProps {
  isExpanded: boolean;
}

const MyWriteList: React.FC<MyWriteListProps> = ({ isExpanded }) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const userToken = useSelector((state) => state.auth.token);

  // Fetch articles on component mount
  useEffect(() => {
    if (!userToken) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await axios.get(`http://localhost:8080/api/articles/user`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
    
        if (response.status === 200) {
          setArticles(response.data);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else if (err.response?.status === 404) {
          setError('게시글을 찾을 수 없습니다.');
        } else {
          setError('네트워크 에러가 발생했습니다. 다시 시도해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };
    

    fetchArticles();
  }, [userToken]);

  // Delete article
  const handleDelete = async (id: number) => {
    if (!userToken) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    Alert.alert('확인', '정말로 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            const response = await axios.delete(`/api/articles/${id}`, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });

            if (response.status === 200) {
              setArticles((prevArticles) =>
                prevArticles.filter((article) => article.post_id !== id)
              );
              setIsModalOpen(false);
              Alert.alert('성공', '게시글이 삭제되었습니다.');
            } else {
              Alert.alert('오류', '게시글 삭제에 실패했습니다.');
            }
          } catch (err) {
            console.error('게시글 삭제 실패:', err.message);
            Alert.alert('오류', '게시글 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  // Edit article
  const handleEdit = async (id: number, title: string, content: string) => {
    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    try {
      const updatedArticle = { title, content };

      const response = await axios.put(`/api/articles/${id}`, updatedArticle, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.post_id === id ? { ...article, ...response.data } : article
          )
        );
        setIsEditing(false);
        setSelectedArticle(null);
        Alert.alert('성공', '게시글이 수정되었습니다.');
      } else {
        Alert.alert('오류', '게시글 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 수정 실패:', err.message);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
  };

  // Modal open/close handlers
  const openModal = (article: ArticleData) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // Render states
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noArticlesText}>게시글이 없습니다.</Text>
      </View>
    );
  }

  // Visible articles based on isExpanded
  const visibleArticles = isExpanded ? articles : articles.slice(0, 2);

  return (
    <>
     <FlatList
  data={visibleArticles}
  keyExtractor={(item) => item?.post_id?.toString() || `unknown-${Math.random()}`}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      style={styles.itemContainer}
    >
      <WriteItem
        title={item.title}
        content={item.content}
        nickname={item.userName || '익명'}
      />
    </TouchableOpacity>
  )}
  contentContainerStyle={styles.listContainer}
  ListEmptyComponent={() => (
    <View style={styles.centered}>
      <Text style={styles.noArticlesText}>게시글이 없습니다.</Text>
    </View>
  )}
/>

      {isModalOpen && selectedArticle && !isEditing && (
        <ArticleModal
          article={selectedArticle}
          onClose={closeModal}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDelete(selectedArticle.post_id)}
        />
      )}
      {isEditing && selectedArticle && (
        <ArticleForm
          mode="edit"
          token={userToken} // 유효한 token을 전달

          initialTitle={selectedArticle.title}
          initialContent={selectedArticle.content}
          onSubmit={(title, content) =>
            handleEdit(selectedArticle.post_id, title, content)
          }
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noArticlesText: {
    fontSize: 16,
    color: '#888',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listContainer: {
    paddingBottom: 16,
  },
});

export default MyWriteList;
