import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // React Native Navigation
import { useDispatch, useSelector } from 'react-redux'; // Redux useDispatch, useSelector 가져오기
import { logout } from '../store/slices/authSlice'; // 로그아웃 액션 가져오기
import userImg from '../assets/images/user.png'; // 사용자 이미지
import exitIcon from '../assets/icons/exit.svg'; // Exit 아이콘
import { RootState } from '../store'; // RootState 타입 가져오기

const User: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux 상태에서 로그인 여부와 닉네임 가져오기
  const { isLoggedIn, nickname } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout()); // 로그아웃 액션 디스패치
    navigation.navigate('Home'); // 메인 페이지로 이동 (Navigation 사용)
  };

  if (!isLoggedIn) {
    // 로그인이 되어 있지 않다면 아무것도 표시하지 않음
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 사용자 이미지 */}
      <Image source={userImg} style={styles.userImage} alt="User Avatar" />

      {/* 로그인된 사용자 닉네임 */}
      <Text style={styles.nickname}>{nickname}</Text>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Image source={exitIcon} style={styles.exitIcon} alt="Exit" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  logoutButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default User;