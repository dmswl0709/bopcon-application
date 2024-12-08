import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AppNavigationParamList from '../navigation/AppNavigatorParamList';
interface GlobalListProps {
  title: string; // 제목
  subtitle?: string; // 부제목 (선택적)
  rightText?: string; // 오른쪽 텍스트 (선택적)
  artistId?: string; // 아티스트 ID (선택적)
}
const GlobalList: React.FC<GlobalListProps> = ({ title, subtitle, rightText, artistId }) => {
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();
  const handleRightTextClick = () => {
    if (rightText && artistId) {
      navigation.navigate('BoardScreen', { artistId }); // 'BoardScreen' 경로로 이동
    }
  };
  return (
    <View style={styles.container}>
      {/* 제목, 가운데 텍스트, 오른쪽 텍스트를 flex로 배치 */}
      <View style={styles.header}>
        {/* 왼쪽: 제목과 부제목 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {/* 오른쪽: 텍스트 (예: 더보기) */}
        {rightText && (
          <TouchableOpacity onPress={handleRightTextClick}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280', // Tailwind의 gray-500
    marginLeft: 8,
  },
  rightText: {
    fontSize: 16,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#9CA3AF', // Tailwind의 gray-400
    marginTop: 8,
  },
});
export default GlobalList;