import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface SelectProps {
  tabs: string[];
  onTabPress: (index: number) => void; // 탭 클릭 시 동작
  activeTab: number; // 현재 활성화된 탭 인덱스
}

const Select: React.FC<SelectProps> = ({ tabs, onTabPress, activeTab }) => {
  return (
    <View style={styles.container}>
      {/* 탭 메뉴 */}
      <View style={styles.tabMenu}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton,
            ]}
            onPress={() => onTabPress(index)}
            accessibilityState={{ selected: activeTab === index }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 584,
    alignSelf: 'center',
  },
  tabMenu: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#D1D5DB', // Tailwind의 gray-300
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F3F4F6', // Tailwind의 gray-100
  },
  activeTabButton: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280', // Tailwind의 gray-500
  },
  activeTabText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Select;