import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Redux 상태 가져오기 및 액션 디스패치
import Layout from '../components/Layout';
import Stack from '../components/Stack';
import Spacer from '../components/Spacer';
import Dismiss from '../assets/icons/Dismiss.svg';
import Person from '../assets/icons/Person.svg';
import AppNavigationParamList from '../navigation/AppNavigatorParamList';
import { RootState } from '../store'; // Redux RootState 타입
import { logout } from '../store/slices/authSlice'; // Redux 액션

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();
  const dispatch = useDispatch();

  // Redux 상태에서 로그인 여부 확인
  const user = useSelector((state: RootState) => state.auth.user);

  const pageList = [
    { name: 'NEW', type: 'NEW' },
    { name: 'ALL', type: 'ALL' },
    { name: 'POP', type: 'POP' },
    { name: 'ROCK', type: 'ROCK' },
    { name: 'HIPHOP', type: 'HIPHOP' },
    { name: 'R&B', type: 'R&B' },
    { name: 'JPOP', type: 'JPOP' },
  ];

  const handleLogout = () => {
    dispatch(logout()); // Redux 상태 초기화
    navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
  };

  return (
    <Layout>
      {/* 상단 헤더 */}
      <Stack direction="horizontal" style={styles.header}>
        <Spacer />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Dismiss width={26} height={26} style={styles.dismissIcon} />
        </TouchableOpacity>
      </Stack>

      {/* 로그인 상태 확인 */}
      <Stack direction="horizontal" justifyContent="start" style={styles.loginContainer}>
        {user ? (
          // 로그인 상태일 때 사용자 이름 표시 (클릭 시 MyPage로 이동)
          <TouchableOpacity onPress={() => navigation.navigate('MyPageScreen')}>
            <Stack direction="horizontal" spacing={10}>
              <Person width={26} height={26} />
              <Text style={styles.userText}>{user}</Text>
            </Stack>
          </TouchableOpacity>
        ) : (
          // 비로그인 상태일 때 로그인 버튼 표시
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Stack direction="horizontal" spacing={10}>
              <Person width={26} height={26} />
              <Text style={styles.loginText}>로그인</Text>
            </Stack>
          </TouchableOpacity>
        )}
      </Stack>

      {/* 페이지 리스트 */}
      <Stack direction="vertical" justifyContent="start" flexible fullHeight fullWidth>
        {pageList.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={() => navigation.navigate('ContentCategoryScreen', { name: item.name, type: item.type })}
          >
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 문의하기 */}
        <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
          <Text style={styles.menuText}>문의하기</Text>
        </TouchableOpacity>

        {/* 서비스 소개 */}
        <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
          <Text style={styles.menuText}>서비스 소개</Text>
        </TouchableOpacity>

        {/* 로그아웃 (로그인 상태에서만 표시) */}
        {user && (
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>
        )}
      </Stack>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  dismissIcon: {
    marginHorizontal: 10,
  },
  loginContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  loginText: {
    fontSize: 16,
  },
  userText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  menuItem: {
    width: '100%',
  },
  menuText: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  divider: {
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    width: '88%',
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default MenuScreen;
