import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ListCardProps {
  concertId: number;
  image: string;
  title: string;
  name: string;
  date: number[]; // 배열 형태
}

const ListCard: React.FC<ListCardProps> = ({ concertId, image, title, name, date }) => {
  const navigation = useNavigation();

  // 날짜 배열을 포맷팅하는 함수
  const formatDate = (dateArray: number[]): string => {
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleCardClick = () => {
    navigation.navigate('ConcertScreen', { concertId }); // React Navigation으로 이동
  };

  return (
    <TouchableOpacity onPress={handleCardClick} style={styles.cardContainer}>
      {/* 이미지 컨테이너 */}
      <Image source={{ uri: image }} style={styles.image} />
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
  cardContainer: {
    flexDirection: 'column',
    width: 250,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2, // Android shadow
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 333,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  name: {
    fontSize: 18,
    color: '#a1a1a1',
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: '#a7a7a7',
    marginTop: 5,
  },
});

export default ListCard;