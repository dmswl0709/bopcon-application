import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DetailNameProps {
  title: string;
  subtitle: string;
}

const DetailName: React.FC<DetailNameProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16, // Tailwind의 `text-lg`에 해당
    fontWeight: 'bold',
    color: '#000', // 기본 텍스트 색상
  },
  subtitle: {
    fontSize: 14, // Tailwind의 `text-sm`에 해당
    color: '#6b7280', // Tailwind의 `text-gray-600` 색상
    paddingVertical: 4, // Tailwind의 `py-1`에 해당
  },
});

export default DetailName;