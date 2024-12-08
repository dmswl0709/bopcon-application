import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MyItem from './MyItem';
import { getUserFavorites } from '../apis/favorites.api'; // 즐겨찾기 API 가져오기
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation } from '@react-navigation/native';

interface MyArtistProps {
  isExpanded: boolean; // 더보기 상태를 받아옴
}

const MyArtist: React.FC<MyArtistProps> = ({ isExpanded }) => {
  const [favoriteArtists, setFavoriteArtists] = useState<any[]>([]); // 즐겨찾기 데이터를 저장
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const token = useSelector((state: RootState) => state.auth.token); // Redux에서 토큰 가져오기
  const navigation = useNavigation(); // 내비게이션 사용

  // 즐겨찾기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      setLoading(true);
      try {
        const favorites = await getUserFavorites({ token });
        console.log('Fetched favorites:', favorites); // API 응답 디버깅
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

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // 유효한 데이터만 필터링
  const filteredArtists = favoriteArtists.filter(
    (artist) => artist.artistName && artist.artistId
  );

  // 더보기 상태에 따라 데이터 조정
  const visibleData = isExpanded ? filteredArtists : filteredArtists.slice(0, 3);

  // 아티스트를 클릭했을 때 처리
  const handlePress = (artistId: number) => {
    navigation.navigate('ArtistScreen', { artistId }); // 'ArtistScreen'으로 이동하며 artistId 전달
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.artistId.toString()} // artistId를 키로 사용
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.artistId)} // 클릭 이벤트 처리
            style={styles.itemContainer}
          >
            <MyItem
              name={item.artistName}
              imgurl={item.imgUrl || 'https://via.placeholder.com/150'} // 이미지 URL 전달 (없으면 플레이스홀더)
            />
          </TouchableOpacity>
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

export default MyArtist;
