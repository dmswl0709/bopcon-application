import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ArtistLike from './ArtistLike'; // ArtistLike 컴포넌트는 그대로 가져옴

interface GlobalSingerHeaderProps {
  krName: string; // 아티스트 이름
  engName: string; // 영어 이름
  likeId: number;
}

const GlobalSingerHeader: React.FC<GlobalSingerHeaderProps> = ({
  krName,
  engName,
  likeId,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.krName}>{krName}</Text>
        <Text style={styles.engName}>{engName}</Text>
      </View>
      <ArtistLike artistId={likeId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  krName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  engName: {
    fontSize: 14,
    color: 'gray',
  },
});

export default GlobalSingerHeader;