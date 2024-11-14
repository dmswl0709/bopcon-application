// src/screens/ConcertScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AppNavigationParamList from '../navigation/AppNavigatorParamList';

type ConcertScreenProps = StackScreenProps<AppNavigationParamList, 'ConcertScreen'>;

const ConcertScreen = ({ route }: ConcertScreenProps) => {
    const { concert } = route.params;

    return (
        <View style={styles.container}>
            <Image source={concert.source} style={styles.image} />
            <Text style={styles.title}>{concert.title}</Text>
            <Text style={styles.singer}>{concert.singer}</Text>
            <Text style={styles.date}>{concert.date}</Text>
            {/* 필요한 추가 정보 표시 */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    singer: {
        fontSize: 18,
        color: 'gray',
    },
    date: {
        fontSize: 16,
        color: 'gray',
    },
});

export default ConcertScreen;
