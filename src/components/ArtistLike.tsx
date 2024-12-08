import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  addFavorite,
  removeFavorite,
  setLoading,
  setError,
} from '../store/slices/artistFavoritesSlice';
import {
  addArtistFavorite as apiAddArtistFavorite,
  removeArtistFavorite as apiRemoveArtistFavorite,
  checkArtistFavorite as apicheckArtistFavorite,
} from '../apis/favorites.api';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';  // react-native-vector-icons 패키지 사용

interface ArtistLikeProps {
  artistId: number;
}

const ArtistLike: React.FC<ArtistLikeProps> = ({ artistId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const loading = useSelector((state: RootState) => state.artistlikes.loading);

  const [favorite, setFavorite] = useState<boolean>(false);

  // 서버에서 즐겨찾기 여부 확인
  useEffect(() => {
    if (!token) return;

    const fetchFavoriteStatus = async () => {
      try {
        const { favorite } = await apicheckArtistFavorite({
          artistId,
          token,
        });
        setFavorite(favorite);
      } catch (error) {
        console.error('Error checking artist favorite status:', error);
      }
    };

    fetchFavoriteStatus();
  }, [token, artistId]);

  const handleLikeToggle = async () => {
    if (!token) {
      Alert.alert('로그인 필요', '로그인이 필요합니다!');
      return;
    }

    dispatch(setLoading(true));

    try {
      if (favorite) {
        await apiRemoveArtistFavorite({ artistId, token });
        dispatch(removeFavorite({ artistId }));
      } else {
        await apiAddArtistFavorite({ artistId, token });
        const newFavorite = {
          favoriteId: Math.random(),
          artistId,
          concertId: null,
        };
        dispatch(addFavorite(newFavorite));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      dispatch(setError('즐겨찾기 처리 중 문제가 발생했습니다.'));
      Alert.alert('오류', '즐겨찾기 처리 중 문제가 발생했습니다.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLikeToggle}
      disabled={loading}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FF1493" />
      ) : favorite ? (
        <Icon name="heart" size={24} color="#FF1493" />
      ) : (
        <Icon name="heart-o" size={24} color="#D3D3D3" />
      )}
    </TouchableOpacity>
  );
};

export default ArtistLike;