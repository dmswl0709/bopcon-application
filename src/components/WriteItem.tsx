import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WriteItemProps {
  title: string; // 제목
  content: string; // 내용
  // date: string; // 작성 날짜 및 시간
  nickname: string; // 작성자 닉네임
  onPress?: () => void; // 클릭 핸들러
}

const WriteItem: React.FC<WriteItemProps> = ({ title, content, nickname, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{`작성자 | ${nickname}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default WriteItem;
