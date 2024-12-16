import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Redux 스토어 타입

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

interface CommentData {
  nickname: string;
  comment_id: number;
  article_id: number;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface MyCommentListProps {
  isExpanded: boolean;
}

const MyCommentList: React.FC<MyCommentListProps> = ({ isExpanded }) => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://api.bopcon.site/api/articles/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('게시글 데이터:', response.data); // 게시글 데이터 확인
        setArticles(response.data);
      } catch (err) {
        console.error('게시글을 불러올 수 없습니다.', err);
        setError('게시글을 불러올 수 없습니다.');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get('https://api.bopcon.site/api/comments/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('댓글 데이터:', response.data); // 댓글 데이터 확인
        setComments(response.data);
      } catch (err) {
        console.error('댓글을 불러올 수 없습니다.', err);
        setError('댓글 데이터를 불러올 수 없습니다.');
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchArticles(); // 게시글 정보 로딩
      await fetchComments(); // 댓글 정보 로딩
      setLoading(false);
    };

    loadData();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#888" />
        <Text style={styles.loadingText}>Loading comments & articles...</Text>
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

  const visibleComments = isExpanded ? comments : comments.slice(0, 2);

  return (
    <FlatList
      data={visibleComments}
      keyExtractor={(item) => item.comment_id}
      renderItem={({ item }) => {
        if (!item) return null;

        // article_id로 articles 배열에서 해당 게시글 찾기
        const article = articles.find((a) => Number(a.id) === Number(item.article_id));

        // article이 없을 경우 "정보 없음"
        const artistName = article?.artistName || '아티스트 정보 없음';
        const articleTitle = article?.title || '게시글 제목 없음';

        return (
          <View style={styles.commentCard}>
            <Text style={styles.label}>아티스트:</Text>
            <Text style={styles.artistValue}>{artistName}</Text>

            <Text style={styles.label}>게시글 제목:</Text>
            <Text style={styles.postTitleValue}>{articleTitle}</Text>

            <Text style={styles.commentText}>{item.content}</Text>

            <View style={styles.footer}>
              <Text style={styles.date}>{item.created_at}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.buttonText}>수정</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.buttonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  artistValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  postTitleValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    backgroundColor: '#eeeeee',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft: 260
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#777',
    fontSize: 14,
  },
  separator: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});

export default MyCommentList;
