import React from 'react';
import { View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import StyledText from '@/components/typography/StyledText';
import Colors from '@/constants/Colors';

interface AmountCircleProps {
  amount: number | string;
  onPress?: () => void;
}

const CIRCLE_SIZE = 40;

export default function AmountCircle({ 
  amount
  ,onPress }: AmountCircleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={[styles.circle, { borderColor: Colors[colorScheme].primary }]}>
      <TouchableOpacity 
      style={[styles.circle, { borderColor: Colors[colorScheme].primary }]}
      onPress={onPress} 
      disabled={!onPress} // Disable touch if no onPress is provided
    >
      <StyledText variant="caption" color={Colors[colorScheme].primary}>
        {amount}
      </StyledText>
    </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
});