import React from 'react';
import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';

interface ConcertInfoProps {
  date: [number, number, number]; // year, month, day 배열 형식
  venueName: string;
  cityName: string;
  countryName: string;
  ticketUrl: string;
}

const ConcertInfo: React.FC<ConcertInfoProps> = ({ date, venueName, cityName, countryName, ticketUrl }) => {
  // 배열을 YYYY-MM-DD 포맷으로 변환
  const formattedDate = `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;

  // 티켓 URL 클릭 핸들러
  const handleTicketPress = () => {
    Linking.openURL(ticketUrl).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>공연 일정</Text>
        <Text style={styles.value}>{formattedDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>공연 장소</Text>
        <Text style={styles.value}>
          {venueName}, {cityName}, {countryName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>티켓 예매</Text>
        <TouchableOpacity onPress={handleTicketPress}>
          <Text style={styles.link}>예매하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: 'black',
    fontWeight: '400',
    fontSize: 14,
  },
  value: {
    color: 'gray',
    fontSize: 14,
  },
  link: {
    color: 'blue',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ConcertInfo;