import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Redux 스토어 타입

interface CommentData {
  nickname: string;
  comment_id: number; // Comment ID
  article_id: number; // Post ID
  content: string; // 댓글 내용
  created_at: string; // 생성일
  updated_at?: string; // 수정일 (Optional)
  artist_name: string; // 아티스트 이름
  article_title: string; // 게시글 제목
}

interface MyCommentListProps {
  isExpanded: boolean; // 더보기 상태
}

const MyCommentList: React.FC<MyCommentListProps> = ({ isExpanded }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token); // Redux에서 token 가져오기

  useEffect(() => {
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`https://api.bopcon.site/api/comments/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰만 Authorization 헤더에 추가
        },
      })
      .then((response) => {
        setComments(response.data); // 상태 업데이트
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch comments:', err); // 에러 로그
        setError('Failed to load comments. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={styles.loadingText}>Loading comments...</Text>
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

  if (comments.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noCommentsText}>No comments available.</Text>
      </View>
    );
  }

  // isExpanded에 따라 표시할 데이터 결정
  const visibleComments = isExpanded ? comments : comments.slice(0, 2);

  return (
    <FlatList
  data={visibleComments}
  keyExtractor={(item) => (item.comment_id ? item.comment_id.toString() : `default_key_${item.article_id}`)}  // comment_id가 없을 경우 대체 값 사용
  renderItem={({ item }) => (
    <View style={styles.commentCard}>
      <Text style={styles.artistName}>아티스트: {item.artist_name}</Text> {/* 아티스트 이름 */}
      <Text style={styles.postTitle}>게시글 제목: {item.article_title}</Text> {/* 게시글 제목 */}
      <Text style={styles.commentText}>{item.content}</Text>
      <View style={styles.footer}>
        <Text style={styles.nickname}>{item.nickname}</Text>
        <Text style={styles.date}>{item.created_at}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    padding: 16,
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
  noCommentsText: {
    fontSize: 16,
    color: '#888',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  artistName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 14,
    color: '#888',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MyCommentList;
