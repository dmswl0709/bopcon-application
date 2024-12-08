import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface ConcertDetailImgProps {
  posterUrl: string;
}

const ConcertDetailImg: React.FC<ConcertDetailImgProps> = ({ posterUrl }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: posterUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 50,
    backgroundColor: '#fff', // Tailwind의 `bg-white`에 해당
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // 비율 유지
  },
});

export default ConcertDetailImg;