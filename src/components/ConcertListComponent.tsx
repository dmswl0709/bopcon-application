// src/components/ConcertListComponent.tsx
import React, { memo } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Concert from '../constants/Concert';
import ConcertComponent from './ConcertComponent';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import { Dimensions } from 'react-native';

interface ConcertComponentProps {
    concerts: Concert[];
    horizontal?: boolean;
}

const ConcertListComponent = ({ concerts, horizontal }: ConcertComponentProps) => {
    const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();

    const handlePress = (concert: Concert) => {
        navigation.navigate('ConcertScreen', { concert }); // 선택한 콘서트 데이터를 ConcertScreen으로 전달
    };

    return (
        <FlatList
            style={{ width: Dimensions.get('window').width }}
            horizontal={horizontal}
            numColumns={horizontal ? undefined : 2}
            columnWrapperStyle={!horizontal && { flex: 1, marginHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
            data={concerts}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item)}>
                    <ConcertComponent {...item} />
                </TouchableOpacity>
            )}
        />
    );
};

export default memo(ConcertListComponent);