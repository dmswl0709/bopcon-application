import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MyItemProps {
  name: string;
  imgurl: string; // 이미지 URL 데이터
}

const MyItem: React.FC<MyItemProps> = ({ name, imgurl }) => {
  return (
    <View style={styles.container}>
      {/* 이미지 표시 */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imgurl || 'https://via.placeholder.com/150', // imgurl이 없으면 플레이스홀더 이미지 사용
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* 이름 표시 */}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32, // 둥근 이미지
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MyItem;
