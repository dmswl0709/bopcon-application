import React from 'react';
import { View, StyleSheet } from 'react-native';
import DetailName from './DetailName';
import Like from './ConcertLike';
import { pastConcertData } from '../constants/pastConcertData';

const GlobalPastConcertHeader: React.FC = () => {
  // 특정 콘서트 데이터를 선택 (예: id가 1인 콘서트 데이터)
  const concert = pastConcertData.find((concert) => concert.id === 1);

  if (!concert) return null; // 데이터가 없을 경우 null 반환

  return (
    <View style={styles.container}>
      <DetailName title={concert.description} subtitle={concert.location} />
      <Like />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white', // 배경색 설정
  },
});

export default GlobalPastConcertHeader;