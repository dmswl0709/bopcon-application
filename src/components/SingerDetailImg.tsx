import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface SingerDetailImgProps {
  Img: string;
}

const SingerDetailImg: React.FC<SingerDetailImgProps> = ({ Img }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: Img || '' }}
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
    backgroundColor: '#fff', // Tailwind의 bg-white에 해당
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // 비율 유지
  },
});

export default SingerDetailImg;