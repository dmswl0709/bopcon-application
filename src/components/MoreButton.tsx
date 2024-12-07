import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MoreButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = ({ isExpanded, onToggle }) => {
  return (
    <View style={styles.container}>
      {/* 텍스트 */}
      <TouchableOpacity onPress={onToggle}>
        <Text style={[styles.text, isExpanded && styles.expandedText]}>
          {isExpanded ? '접기' : '더보기'}
        </Text>
      </TouchableOpacity>
      {/* 선 */}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    textAlign: 'center',
    color: '#6B7280', // Tailwind의 gray-500
    fontSize: 14,
  },
  expandedText: {
    color: '#1D4ED8', // Tailwind의 blue-700
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: '#9CA3AF', // Tailwind의 gray-400
    marginTop: 16,
  },
});

export default MoreButton;