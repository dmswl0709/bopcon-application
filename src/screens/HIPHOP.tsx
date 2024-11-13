// src/screens/HIPHOP.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationView from '../components/NavigationView';
import ConcertListComponent from '../components/ConcertListComponent';
import sample1 from '../assets/images/sampleimg1.jpg';
import sample2 from '../assets/images/sampleimg2.png';

const HIPHOP = () => {
  const data = [
    { id: '1', title: 'sample', name: 'name', date: '1111.11.11', image: sample1 },
    { id: '2', title: 'sample', name: 'name', date: '1111.11.11', image: sample2 },
    { id: '3', title: 'sample', name: 'name', date: '1111.11.11', image: sample1 },
    { id: '4', title: 'sample', name: 'name', date: '1111.11.11', image: sample2 },
    { id: '5', title: 'sample', name: 'name', date: '1111.11.11', image: sample1 },
    { id: '6', title: 'sample', name: 'name', date: '1111.11.11', image: sample2 },
  ];

  return (
    <NavigationView>
      <View style={styles.container}>
        <Text style={styles.header}>HIPHOP</Text>
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

export default HIPHOP;
