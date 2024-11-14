// src/components/GlobalButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface GlobalButtonProps {
  text: string;
  variant: 'black' | 'white';
  onPress?: () => void;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({ text, variant, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, variant === 'black' ? styles.blackButton : styles.whiteButton]}>
      <Text style={[styles.text, variant === 'black' ? styles.blackText : styles.whiteText]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  blackButton: {
    backgroundColor: 'black',
    borderColor: 'transparent',
  },
  whiteButton: {
    backgroundColor: 'white',
    borderColor: '#727272',
  },
  text: {
    fontSize: 14,
  },
  blackText: {
    color: 'white',
  },
  whiteText: {
    color: 'black',
  },
});

export default GlobalButton;
