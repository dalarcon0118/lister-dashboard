import React from 'react';
import { View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import StyledText from '@/components/typography/StyledText';
import Colors from '@/constants/Colors';

interface BetCircleProps {
  value: number | string;
  onPress?: () => void; // Added onPress prop
}

const CIRCLE_SIZE = 40;

export default function BetCircle({ value, onPress }: BetCircleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    // Changed View to TouchableOpacity and added onPress
    <TouchableOpacity 
      style={[styles.circle, { borderColor: Colors[colorScheme].primary }]}
      onPress={onPress} 
      disabled={!onPress} // Disable touch if no onPress is provided
    >
      <StyledText variant="caption" color={Colors[colorScheme].primary}>
        {value}
      </StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
});