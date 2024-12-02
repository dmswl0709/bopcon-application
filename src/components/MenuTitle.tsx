// src/components/MenuTitle.tsx

import React, { memo } from 'react';
import { Text } from 'react-native';
import Stack from './Stack';
import Spacer from './Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/core';
import AppNavigationParamList from '../navigation/AppNavigatorParamList';

interface MenuTitleProps {
  title: string;
  navigateName?: keyof AppNavigationParamList; // 이동할 스크린 이름
  navigateParams?: any; // 스크린으로 전달할 파라미터
}

const MenuTitle = ({ title, navigateName, navigateParams }: MenuTitleProps) => {
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

  return (
    <Stack direction="horizontal" style={{ paddingTop: 18, paddingBottom: 4, paddingHorizontal: 16 }}>
      {/* 타이틀 */}
      <Text style={{ fontSize: 22, fontWeight: '900', fontFamily: 'Pretendard' }}>{title}</Text>
      <Spacer />
      {/* 더보기 버튼 */}
      <TouchableOpacity
        onPress={() => {
          if (navigateName) {
            navigation.navigate(navigateName, navigateParams); // navigate 동작 설정
          }
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#8C8C8C', fontFamily: 'Pretendard' }}>
          더보기
        </Text>
      </TouchableOpacity>
    </Stack>
  );
};

export default memo(MenuTitle);
