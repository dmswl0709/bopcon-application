// src/components/ConcertListComponent.tsx
import React, { memo } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Concert from '../constants/Concert';
import ConcertComponent from './ConcertComponent';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppNavigationParamList from "../navigation/AppNavigatorParamList";
import { Dimensions } from 'react-native';

type ConcertComponentProps = {
    concerts: any[];
    horizontal?: boolean;
    onConcertPress: (concert: any) => void;  
};

const ConcertListComponent: React.FC<ConcertComponentProps> = ({
    concerts,
    horizontal = false,
    onConcertPress,
  }) => {

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