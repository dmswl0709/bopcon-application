// src/components/ConcertInfo.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { concertInfoData } from '../constants/concertInfoData';

const ConcertInfo: React.FC = () => {
  const { schedule, location, ticket } = concertInfoData;

  return (
    <View style={styles.container}>
      <InfoRow label="공연 일정" value={schedule} />
      <InfoRow label="공연 장소" value={location} />
      <InfoRow label="티켓 예매" value={ticket} />
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: '300',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
});

export default ConcertInfo;
