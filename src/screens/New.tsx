// src/screens/NEW.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationView from '../components/NavigationView'; // NavigationView 컴포넌트
import ConcertListComponent from '../components/ConcertListComponent'; // 기존의 ConcertListComponent 가져오기
import sample1 from '../assets/images/sampleimg1.jpg'; // 이미지 경로
import sample2 from '../assets/images/sampleimg2.png';


const NEW = () => {
  // 샘플 데이터
  const data = [
    { id: '1', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg1 },
    { id: '2', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg2 },
    { id: '3', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg3 },
    { id: '4', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg1 },
    { id: '5', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg2 },
    { id: '6', title: 'sample', name: 'name', date: '1111.11.11', image: sampleimg3 },
  ];

  return (
    <NavigationView>
      <View style={styles.container}>
        <Text style={styles.header}>NEW</Text>
        <ConcertListComponent concerts={data} />
      </View>
    </NavigationView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default NEW;
