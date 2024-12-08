import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Redux 스토어 타입
import WriteItem from './WriteItem'; // React Native로 변환된 WriteItem 컴포넌트를 가져옵니다.

interface CommentData {
  nickname: string;
  comment_id: number; // Comment ID
  post_id: number; // Post ID
  content: string; // 댓글 내용
  created_at: string; // 생성일
  updated_at?: string; // 수정일 (Optional)
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
      .get(`/api/comments/user`, {
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
      keyExtractor={(item) => item.comment_id.toString()}
      renderItem={({ item }) => (
        <WriteItem
          key={item.comment_id}
          title={item.content}
          nickname={item.nickname}
          content={''} // 필요한 경우 내용을 추가
          date={item.created_at} // 작성일 추가
        />
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
});

export default MyCommentList;