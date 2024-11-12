import React, {memo, useEffect, useState} from 'react';
import Stack from './Stack';
import { FlatList, PanGestureHandler, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Concert from '../constants/Concert';
import ConcertComponent from './ConcertComponent';

interface ConcertComponentProps {
    concerts: Concert[];
}

const ConcertListComponent = ({concerts}: ConcertComponentProps) => {
    const width = 250

    return (
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={concerts}
        renderItem={({item}) =>  <ConcertComponent {...item}/>}>
        </FlatList>
    );
  };
  
  export default memo(ConcertListComponent);