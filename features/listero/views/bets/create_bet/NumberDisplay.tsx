import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

interface NumberDisplayProps {
  numbers: string;
  gameTypeCode: 'fijo' | 'parlet' | 'centena' | null;
}

export default function NumberDisplay({
  numbers,
  gameTypeCode,
}: NumberDisplayProps) {
  console.log('gameTypeCode', gameTypeCode);
  console.log('numbers', numbers);
  const theme = useTheme();
  const joinNumbers = (numbers: string) => {
    const pairs = [];
     
      for (let i = 0; i < numbers.length; i += 2) {
        if (i + 1 < numbers.length) {
          pairs.push(numbers.substring(i, i + 2));
        }
      }
      return pairs.join(' - ');
  };

  if (!gameTypeCode || !numbers) {
    return (
      <View style={styles.container}>
        <Text category="h5" appearance="hint">
          Ingrese números
        </Text>
      </View>
    );
  }

  const formatNumbers = () => {
    if (gameTypeCode === 'fijo') {
      return joinNumbers(numbers); // Aplicar formato para el juego de fijo
    } else if (gameTypeCode === 'centena') {
      return numbers;
    } else if (gameTypeCode === 'parlet') {
      return joinNumbers(numbers); // Aplicar formato para el juego de parlet
      
    }
    return numbers;
  };

  return (
    <View 
      style={[
        styles.container, 
        {
          backgroundColor: theme['background-basic-color-2'],
          borderColor: theme['border-basic-color-3'],
        }
      ]}
    >
      <Text category="h3" style={styles.numbers}>
        {formatNumbers()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 16,
  },
  numbers: {
    letterSpacing: 2,
  },
});