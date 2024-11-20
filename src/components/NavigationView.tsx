import React, { memo, ReactNode } from 'react';
import { Text } from 'react-native';
import Layout from './Layout';
import Stack, { StackProps } from './Stack';
import Spacer from './Spacer';
import BOPCONLogo from '../assets/icons/BOPCONLogo.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Search from '../assets/icons/search.svg';
import Menu from '../assets/icons/menu.svg';
import { useNavigation } from '@react-navigation/native';

interface NavigationViewProps extends Omit<StackProps, 'direction' | 'flexible'> {
  children?: ReactNode;
  navigationViewScrollable?: boolean;
  scrollable?: boolean;
}

const NavigationView = ({
  children,
  navigationViewScrollable,
  scrollable,
  ...stackProps
}: NavigationViewProps) => {
  const navigation = useNavigation();

  return (
    <Layout scrollable={navigationViewScrollable}>
      <Stack direction="horizontal" style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        {/* BOPCONLogo를 TouchableOpacity로 감싸고 onPress 이벤트 추가 */}
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <BOPCONLogo width={110} height={40}>BOPCON</BOPCONLogo>
        </TouchableOpacity>
        <Spacer />
        <Stack direction="horizontal" spacing={14}>
          <TouchableOpacity>
            <Search width={26} height={26} style={{ margin: 10 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')}>
            <Menu width={26} height={26} style={{ margin: 10 }} />
          </TouchableOpacity>
        </Stack>
      </Stack>
      <Stack
        scrollable={scrollable}
        direction="vertical"
        justifyContent="start"
        flexible
        fullHeight
        {...stackProps}
      >
        {children}
      </Stack>
    </Layout>
  );
};

export default memo(NavigationView);