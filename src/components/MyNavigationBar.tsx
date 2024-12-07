import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // React Native Navigation
import mylogo from '../assets/icons/mypage.svg'; // PNG 형식 이미지로 사용
import behindIcon from '../assets/icons/behind.svg'; // PNG 형식 이미지로 사용

const MyNavigationBar = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // 뒤로 가기
  };

  return (
    <View style={styles.header}>
      {/* 뒤로 가기 아이콘 */}
      <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
        <Image source={behindIcon} style={styles.icon} alt="뒤로 가기" />
      </TouchableOpacity>

      {/* 로고 */}
      <Image source={mylogo} style={styles.logo} alt="mypage Logo" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginTop: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  logo: {
    width: 90,
    height: 25,
    marginRight: 'auto',
  },
});

export default MyNavigationBar;