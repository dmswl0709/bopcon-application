// components/MyCommentList.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store'; // Redux 스토어 타입
import { fetchUserArticles } from '../store/slices/articleSlice'; // Thunk 액션

interface CommentData {
  id: number;
  article_id?: number; // 선택적 필드로 설정
  content: string;
  createdAt: string; // 실제 데이터 형식에 맞게 수정 (예: ISO 문자열)
  nickname: string;
  updatedAt: string; // 실제 데이터 형식에 맞게 수정 (예: ISO 문자열)
  articleTitle: string;
}

interface MyCommentListProps {
  isExpanded: boolean;
}

const MyCommentList: React.FC<MyCommentListProps> = ({ isExpanded }) => {
  const dispatch = useDispatch<AppDispatch>();
  const articles = useSelector((state: RootState) => state.articles.articles);
  const articlesLoading = useSelector((state: RootState) => state.articles.loading);
  const articlesError = useSelector((state: RootState) => state.articles.error);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const token = useSelector((state: RootState) => state.auth.token);

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    try {
      const response = await axios.get<CommentData[]>('https://api.bopcon.site/api/comments/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Comments:', response.data); // 디버깅용

      // response.data가 배열인지 확인
      const fetchedComments = Array.isArray(response.data) ? response.data : [];
      setComments(fetchedComments);
    } catch (err: any) {
      console.error(err);
      setError('댓글 데이터를 불러올 수 없습니다.');
    }
  };

  // 게시글 데이터 가져오기 via Redux
  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 게시글 데이터가 로드되지 않았다면 불러옴
        if (articles.length === 0) {
          await dispatch(fetchUserArticles(token));
        }
        // 댓글 데이터 불러오기
        await fetchComments();
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, dispatch, articles.length]);

  // 댓글 삭제 (삭제 확인 창 추가)
  const deleteComment = (commentId: number) => {
    Alert.alert(
      '삭제 확인',
      '댓글을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://api.bopcon.site/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('삭제 완료', '댓글이 삭제되었습니다.');
              fetchComments();
            } catch (err: any) {
              console.error(err);
              Alert.alert('삭제 실패', '댓글 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 댓글 수정
  const updateComment = async (commentId: number, content: string) => {
    try {
      await axios.put(
        `https://api.bopcon.site/api/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('수정 완료', '댓글이 수정되었습니다.');
      setEditingCommentId(null);
      fetchComments();
    } catch (err: any) {
      console.error(err);
      Alert.alert('수정 실패', '댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // 디버깅 로그
  console.log('Articles length:', articles.length);
  console.log('Comments length:', comments.length);

  if (loading || articlesLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={styles.loadingText}>Loading comments...</Text>
      </View>
    );
  }

  if (error || articlesError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || articlesError}</Text>
      </View>
    );
  }

  // 댓글이 배열인지 확인하고, 아니면 빈 배열로 설정
  const visibleComments = Array.isArray(comments) ? (isExpanded ? comments : comments.slice(0, 2)) : [];

  return (
    <FlatList
      data={visibleComments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.commentCard}>
          {/* 게시글 제목 표시 */}
          <Text style={styles.articleTitle}>
            게시글 제목: {item.articleTitle || '제목 없음'}
          </Text>
  
          {/* 댓글 내용 또는 수정 모드 */}
          {editingCommentId === item.id ? (
            <TextInput
              style={styles.input}
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="댓글 내용을 수정하세요."
            />
          ) : (
            <Text style={styles.commentText}>{item.content}</Text>
          )}
  
          {/* 댓글 수정/삭제 버튼 */}
          <View style={styles.actions}>
            {editingCommentId === item.id ? (
              <>
                <TouchableOpacity onPress={() => updateComment(item.id, editedContent)}>
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingCommentId(null)}>
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCommentId(item.id);
                    setEditedContent(item.content);
                  }}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteComment(item.id)}>
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
  
};

const styles = StyleSheet.create({
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 8, 
    fontSize: 16, 
    color: '#888' 
  },
  errorText: { 
    fontSize: 16, 
    color: 'red' 
  },
  listContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#555', 
    marginBottom: 4 
  },
  postTitleValue: { 
    fontSize: 14, 
    color: '#333', 
    marginBottom: 8 
  },
  commentText: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 8 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#999', 
    fontSize: 14, 
    marginHorizontal: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: 8, 
    marginVertical: 8 
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
});

export default MyCommentList;
