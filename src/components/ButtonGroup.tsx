// src/components/ButtonGroup.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

type ButtonGroupProps = {
    onArtistInfoPress: () => void;
    onPastSetlistPress: () => void;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ onArtistInfoPress, onPastSetlistPress }) => {
    return (
        <View style={styles.buttonContainer}>
            <Button title="아티스트 정보" onPress={onArtistInfoPress} />
            <Button title="지난 공연 셋리스트" onPress={onPastSetlistPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
});

export default ButtonGroup;
