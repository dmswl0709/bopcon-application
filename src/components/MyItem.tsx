import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyItemProps {
  name: string;
  number: number; // number 데이터를 추가로 받음
}

const MyItem: React.FC<MyItemProps> = ({ name, number }) => {
  return (
    <View style={styles.container}>
      {/* 번호 표시 */}
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{number}</Text> {/* number 표시 */}
      </View>

      {/* 아티스트 이름 표시 */}
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  numberContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A', // 텍스트 색상
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A', // 텍스트 색상
  },
});

export default MyItem;