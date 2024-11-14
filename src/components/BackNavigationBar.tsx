// src/components/BackNavigationBar.tsx

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/icons/BOBCONIcon.png';
import behindIcon from '../assets/icons/behind.png';

const BackNavigationBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
        <Image source={behindIcon} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  iconButton: {
    width: 30,
    height: 30,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logo: {
    width: 90,
    height: 25,
    resizeMode: 'contain',
  },
});

export default BackNavigationBar;
