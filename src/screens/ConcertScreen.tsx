// src/screens/ConcertScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Header from '../components/Header';
import ButtonGroup from '../components/ButtonGroup';

type ConcertScreenProps = StackScreenProps<any, 'ConcertScreen'>;

const ConcertScreen: React.FC<ConcertScreenProps> = ({ route, navigation }) => {
    const { concert } = route.params;

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleArtistInfoPress = () => {
        console.log('아티스트 정보 버튼 클릭');
    };

    const handlePastSetlistPress = () => {
        console.log('지난 공연 셋리스트 버튼 클릭');
    };

    return (
        <View style={styles.container}>
            <Header title="Concert" onBackPress={handleBackPress} />
            <ScrollView>
                <Image source={{ uri: concert.image }} style={styles.image} />
                <Text style={styles.title}>{concert.title}</Text>
                <Text style={styles.details}>{concert.details}</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>공연 일정</Text>
                    <Text style={styles.infoValue}>{concert.date}</Text>
                    <Text style={styles.infoLabel}>공연 장소</Text>
                    <Text style={styles.infoValue}>{concert.location}</Text>
                    <Text style={styles.infoLabel}>티켓 예매</Text>
                    <Text style={styles.infoValue}>{concert.ticket}</Text>
                </View>

                <ButtonGroup
                    onArtistInfoPress={handleArtistInfoPress}
                    onPastSetlistPress={handlePastSetlistPress}
                />

                <Text style={styles.setlistTitle}>예상 셋리스트</Text>
                {concert.setlist.map((song: string, index: number) => (
                    <Text key={index} style={styles.setlistItem}>
                        {index + 1}. {song}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        margin: 16,
    },
    details: {
        fontSize: 16,
        color: 'gray',
        marginHorizontal: 16,
    },
    infoContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        marginBottom: 8,
    },
    setlistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 24,
    },
    setlistItem: {
        fontSize: 16,
        marginHorizontal: 16,
        marginVertical: 4,
    },
});

export default ConcertScreen;
