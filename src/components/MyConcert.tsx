import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import MyItem from './MyItem';
import { getUserFavorites } from '../apis/favorites.api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface MyConcertProps {
  isExpanded: boolean; // 더보기 상태를 받아옴
}

const MyConcert: React.FC<MyConcertProps> = ({ isExpanded }) => {
  const [favoriteArtists, setFavoriteArtists] = useState<any[]>([]); // 즐겨찾기 데이터를 저장
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const token = useSelector((state: RootState) => state.auth.token); // Redux에서 토큰 가져오기

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      setLoading(true);
      try {
        const favorites = await getUserFavorites({ token });
        setFavoriteArtists(favorites);
        setError(null);
      } catch (err) {
        setError('즐겨찾기 데이터를 불러오지 못했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  // newConcertTitle이 null이 아닌 항목만 필터링
  const filteredData = favoriteArtists.filter((concert) => concert.newConcertTitle !== null);

  // isExpanded가 true면 모든 데이터, false면 2개만 표시
  const visibleData = isExpanded ? filteredData : filteredData.slice(0, 2);

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <MyItem name={item.newConcertTitle} number={item.favoriteId} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  itemContainer: {
    marginBottom: 8,
  },
});

export default MyConcert;