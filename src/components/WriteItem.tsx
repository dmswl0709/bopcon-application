import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WriteItemProps {
  title: string; // 제목
  content: string; // 내용
  date: string; // 작성 날짜 및 시간
  nickname: string; // 작성자 닉네임
  onClick?: () => void; // onClick 핸들러 추가
}

const WriteItem: React.FC<WriteItemProps> = ({ title, content, date, nickname, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <View style={styles.content}>
        {/* 제목 */}
        <Text style={styles.title}>{title}</Text>
        
        {/* 내용 */}
        <Text style={styles.body}>{content}</Text>

        {/* 하단 작성 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{`${date} | ${nickname}`}</Text>
        </View>

        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    cursor: 'pointer', // React Native는 pointer 스타일이 없으므로 무시하거나 웹 전용 환경에서만 사용
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  body: {
    fontSize: 14,
    color: '#4A4A4A',
    marginTop: 8,
  },
  footer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  divider: {
    borderTopWidth: 1,
    borderColor: '#000',
    marginTop: 8,
  },
});

export default WriteItem;