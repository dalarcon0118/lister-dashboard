import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text,Button, useTheme } from '@ui-kitten/components';
import { ArrowUpDown } from 'lucide-react-native';
import { GameTypeCodes,AnnotationType } from '@/constants/Bet';

interface NumericKeyboardProps {
  isRangeMode: boolean;
  onNumberPress: (number: string) => void;
  onRangePress: () => void;
  gameType:GameTypeCodes;
  anotationType:AnnotationType;
}

export default function NumericKeyboard({ 
  isRangeMode, 
  onNumberPress, 
  onRangePress,
  anotationType,
  gameType
}: NumericKeyboardProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const theme = useTheme();
  useEffect(() => {
    console.log('NumericKeyboard is now visible and active.');
    // Aquí puedes añadir lógica adicional si es necesario,
    // como enfocar el primer botón para accesibilidad si usas refs,
    // o realizar alguna animación.
  }, []); // El array vacío asegura que se ejecute solo una vez al montarse\  \
  return (
    
    <View style={styles.container}>
      <View style={styles.grid}>
        {numbers.map((number) => (
        <Button
        key={number}
        appearance='ghost'
        status='primary'
        style={{...styles.button,backgroundColor: theme['color-primary-100'],
          borderColor: theme['color-primary-500']}}
        onPress={() =>onNumberPress(number)}
      >
        <Text style={styles.buttonText}>{number}</Text>
      </Button>
         
        ))}
         <TouchableOpacity
        style={[styles.button]}
        onPress={onRangePress}
      >
        <ArrowUpDown size={24} color="#000" />
        <Text style={styles.buttonText}>
          {isRangeMode ? 'Fin de Rango' : 'Rango'}
        </Text>
      </TouchableOpacity>
      </View>
      
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rangeButton: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    
    height: 60,
  },
});