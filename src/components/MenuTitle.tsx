import React, { memo } from 'react';
import { Button, Text } from 'react-native';
import Stack from './Stack';
import Spacer from './Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface MenuTitleProps {
   title: String;
   navigateName?: String;
}

const MenuTitle = ({ title, navigateName }: MenuTitleProps) => {
    return (
         <Stack direction="horizontal" style={{ paddingTop: 18, paddingBottom: 4, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', fontFamily: 'Pretendard' }}>{title}</Text>
            <Spacer />
            <TouchableOpacity onPress={() => {}}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#8C8C8C', fontFamily: 'Pretendard' }}>더보기</Text>
            </TouchableOpacity>
         </Stack>
    );
};

export default memo(MenuTitle);
