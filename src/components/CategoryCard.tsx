import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ListCardProps {
  concertId: number; // concertId 추가
  image: string;
  title: string;
  name: string;
  date: number[]; // 배열 형태로 수정
  onPress: (concertId: number) => void; // 클릭 핸들러를 prop으로 전달
}

const ListCard: React.FC<ListCardProps> = ({
  concertId,
  image,
  title,
  name,
  date,
  onPress,
}) => {
  // 날짜 배열을 포맷팅하는 함수
  const formatDate = (dateArray: number[]): string => {
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(concertId)}
      style={styles.container}
    >
      {/* 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      {/* 텍스트 정보 */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4, // 이미지 비율 유지 (3:4)
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    paddingHorizontal: 12,
    marginTop: -8, // 텍스트와 이미지 간격 조정
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 16,
    color: '#a1a1a1',
  },
  date: {
    fontSize: 14,
    color: '#a7a7a7',
  },
});

export default ListCard;