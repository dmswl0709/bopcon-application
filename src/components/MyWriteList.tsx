import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import WriteItem from './WriteItem';

interface ArticleData {
  post_id: number; // Post ID
  artist_id: number; // Artist ID
  title: string; // 글 제목
  content: string; // 글 내용
  created_at: string; // 생성일
  updated_at?: string; // 수정일 (Optional)
  userName: string; // 사용자 이름
}

interface MyWriteListProps {
  isExpanded: boolean; // 더보기 상태
}

const MyWriteList: React.FC<MyWriteListProps> = ({ isExpanded }) => {
  const route = useRoute(); // React Navigation의 route 사용
  const { id } = (route.params || {}) as { id?: string }; // URL에서 id 추출 (기본값 설정)
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 날짜 포맷 함수 (예: "2024-11-01T12:30:00Z" -> "2024-11-01 12:30")
  const formatDate = (dateTime: string) => {
    if (!dateTime) return ''; // 유효하지 않으면 빈 문자열 반환
    const [date, time] = dateTime.split('T');
    if (!time) return date; // 시간이 없으면 날짜만 반환
    const [hour, minute] = time.split(':');
    return `${date} ${hour}:${minute}`;
  };

  useEffect(() => {
    if (!id) {
      console.error('ID is missing.');
      setError('ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);

    console.log(`Fetching articles for ID: ${id}`); // 디버깅용 로그

    axios
      .get(`/api/articles/${id}`) // API 호출
      .then((response) => {
        console.log('Fetched articles:', response.data); // 응답 데이터 확인
        setArticles(response.data); // 상태 업데이트
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch articles:', err); // 에러 로그
        setError('Failed to load articles. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading articles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No articles available.</Text>
      </View>
    );
  }

  // isExpanded에 따라 표시할 데이터 결정
  const visibleArticles = isExpanded ? articles : articles.slice(0, 2);

  return (
    <FlatList
      data={visibleArticles}
      keyExtractor={(item) => item.post_id.toString()}
      renderItem={({ item }) => (
        <WriteItem
          title={item.title} // 글 제목
          content={item.content} // 글 내용
          date={formatDate(item.updated_at || item.created_at)} // 날짜 포맷팅
          nickname={item.userName} // 실제 userName을 사용
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MyWriteList;