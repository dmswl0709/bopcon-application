import React, {memo} from 'react';
import {ImageSourcePropType, Text, Image, Dimensions, TouchableWithoutFeedback} from 'react-native';
import Stack from './Stack';
import Spacer from './Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Concert from '../constants/Concert';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import concert from "../constants/Concert";
import AppNavigationParamList from '../navigation/AppNavigatorParamList';
import ContentScreen from '../screens/ContentScreen';

type ConcertComponentProps = { } & Concert

const ConcertComponent = ({title, singer, date, source, navigateName}: ConcertComponentProps) => {
    const navigation = useNavigation<NavigationProp<AppNavigationParamList>>()
    
    const width = (Dimensions.get('window').width -60)/2
    return (
        <TouchableWithoutFeedback onPress={() => {
             navigation.navigate("ConcertScreen",{ concert:{title, singer, date, source}})
        }} >
            <Stack direction='vertical' spacing={4} style={{paddingVertical: 18, paddingHorizontal: 10}}>
                <Image source={source} style={{width: width,height: 333/250*width, resizeMode:"cover"}}/>
                <Stack direction='vertical' fullWidth alignment='start' spacing={8}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold'}}>{title}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8C8C8C'}}>{singer}</Text>
                    <Text style={{ fontSize: 14, color: '#8C8C8C'}}>.{date}</Text>
                </Stack>
            </Stack>
         </TouchableWithoutFeedback>
    );
  };
  
  export default memo(ConcertComponent);