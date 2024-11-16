// src/components/GlobalConcertHeader.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DetailName from './DetailName';
import Like from './Like';
import { concertData } from '../constants/concertData';

const GlobalConcertHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <DetailName title={concertData.title} subtitle={concertData.subtitle} />
      <Like />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default GlobalConcertHeader;
