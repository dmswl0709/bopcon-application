import React, {memo} from 'react';
import { ImageSourcePropType, Text, Image, Dimensions } from 'react-native';
import Stack from './Stack';
import Spacer from './Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Concert from '../constants/Concert';

type ConcertComponentProps = { } & Concert

const ConcertComponent = ({title, singer, date, source, navigateName}: ConcertComponentProps) => {
    const width = (Dimensions.get('window').width -60)/2
    return (
        <TouchableOpacity onPress={() => {}} >
            <Stack direction='vertical' spacing={4} style={{paddingVertical: 18, paddingHorizontal: 10}}>
                <Image source={source} style={{width: width,height: 333/250*width, resizeMode:"cover"}}/>
                <Stack direction='vertical' fullWidth alignment='start' spacing={8}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold'}}>{title}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8C8C8C'}}>{singer}</Text>
                    <Text style={{ fontSize: 14, color: '#8C8C8C'}}>.{date}</Text>
                </Stack>
            </Stack>
         </TouchableOpacity>
    );
  };
  
  export default memo(ConcertComponent);