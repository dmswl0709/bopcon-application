import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import Stack from '../components/Stack';
import Spacer from '../components/Spacer';
import Dismiss from '../assets/icons/Dismiss.svg';
import Person from '../assets/icons/Person.svg';
import AppNavigationParamList from '../navigation/AppNavigatorParamList';

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

  const pageList = [
    { name: "NEW", type: "NEW" },
    { name: "ALL", type: "ALL" },
    { name: "POP", type: "POP" },
    { name: "ROCK", type: "ROCK" },
    { name: "HIPHOP", type: "HIPHOP" },
    { name: "R&B", type: "R&B" },
    { name: "JPOP", type: "JPOP" }
  ];

  return (
    <Layout>
      <Stack direction='horizontal' style={{ paddingHorizontal: 16 }}>
        <Spacer />
        <Stack direction='horizontal' spacing={14}>
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Dismiss width={26} height={26} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
        </Stack>
      </Stack>
      <Stack direction='horizontal' justifyContent='start' style={{ paddingHorizontal: 16, paddingVertical: 8, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }}>
          <Stack direction='horizontal' spacing={10}>
            <Person width={26} height={26} />
            <Text style={{ fontSize: 16 }}>로그인</Text>
          </Stack>
        </TouchableOpacity>
      </Stack>
      <Stack direction='vertical' justifyContent='start' flexible fullHeight fullWidth>
        {
          pageList.map((item, idx) =>
            <TouchableOpacity key={idx} style={{ width: '100%' }} onPress={() => { navigation.navigate('ContentCategoryScreen', { name: item.name, type: item.type }) }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, width: '100%' }}>{item.name}</Text>
            </TouchableOpacity>)
        }

        <View style={styles.divider} />


        <TouchableOpacity onPress={() => { }} style={{ width: '100%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 16, paddingHorizontal: 16, marginLeft: 10, width: '100%' }}>문의하기</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }} style={{ width: '100%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 16, paddingHorizontal: 16, marginLeft: 10, width: '100%' }}>서비스 소개</Text>
        </TouchableOpacity>
      </Stack>
    </Layout>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderBottomColor: '#D3D3D3', // 연회색 경계선
    borderBottomWidth: 1,
    width: '88%', // 선의 길이를 조정
    alignSelf: 'center', // 중앙 정렬
    marginVertical: 8,
  },
});

export default MenuScreen;
