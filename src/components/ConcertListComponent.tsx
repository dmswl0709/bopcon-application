import React, {memo, useEffect, useState} from 'react';
import Stack from './Stack';
import { FlatList, PanGestureHandler, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Concert from '../constants/Concert';
import ConcertComponent from './ConcertComponent';
import { Dimensions } from 'react-native';

interface ConcertComponentProps {
    concerts: Concert[];
    horizontal?: boolean;
}

const ConcertListComponent = ({concerts, horizontal}: ConcertComponentProps) => {

    return (
        <FlatList
        style = {{width:Dimensions.get('window').width}}
        horizontal = {horizontal}
        numColumns= {horizontal ? undefined: 2}
        columnWrapperStyle={!horizontal&&{flex :1, marginHorizontal:10}}
        showsHorizontalScrollIndicator={false}
        data={concerts}
        renderItem={({item}) =>  <ConcertComponent {...item}/>}>
        </FlatList>
    );
  };
  
  export default memo(ConcertListComponent);