// src/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
    title: string;
    onBackPress: () => void;
};

const Header: React.FC<HeaderProps> = ({ title, onBackPress }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBackPress}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default Header;
