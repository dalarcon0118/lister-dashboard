import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/typography/StyledText';
import Layout from '@/constants/Layout';
import AmountCircle from './AmountCircle';
import BetCircle from './BetCircle';
import { FijosCorridosBet } from '@/types';
import NumericKeyboard from './NumericKeyboard';
import { useFijosParlet } from './hooks/useFijosParlet';
import BottomDrawer from '@/components/ui/BottomDrawer';
import { AnnotationTypes, GameTypes } from '@/constants/Bet';

interface FijoCorridoBet {
  id: string;
  bet: number;
  fijoAmount: number | 'X';
  corridoAmount: number | 'X';
}

interface FijosCorridosColumnProps {
  bets: FijoCorridoBet[];
}

export default function FijosCorridosColumn() {
  const { 
    fijosCorridosList,
    isRangeMode,
    showNumericKeyboard,
    hideNumericKeyboard,
    handleFijosBet,
    handleAddBetPress,
    handleAmountCirclePress,
    showAmountNumericKeyboardState,
  } = useFijosParlet()

  const onPressedListerBet = (value: string) => {
    handleFijosBet(value)
  }

  const onPressedListerAmount = (value: string) => {
    //handleAmount(value)
  }
  
  const showKeyboard = () => {
    return(
        <BottomDrawer isVisible ={showNumericKeyboard} onClose={hideNumericKeyboard} title='' height={"50%"}>
          
          <NumericKeyboard
          isRangeMode={isRangeMode}
          onNumberPress={onPressedListerBet}
          onRangePress={()=> {}}
          anotationType={AnnotationTypes.Bet}
          gameType={GameTypes.FIJOS_CORRIDOS}
        />
      </BottomDrawer>
    );
    };
  const showAmountNumericKeyboard = () => {
      return(
          <BottomDrawer isVisible ={showAmountNumericKeyboardState} onClose={hideNumericKeyboard} title='' height={"50%"}>
            
            <NumericKeyboard
            isRangeMode={isRangeMode}
            onNumberPress={onPressedListerAmount}
            onRangePress={()=> {}}
            anotationType={AnnotationTypes.Bet}
            gameType={GameTypes.FIJOS_CORRIDOS}
          />
        </BottomDrawer>
      );
      };

  return (
    <View style={[styles.column, styles.colFijos]}>
      <View style={styles.columnContent}>
        
        {fijosCorridosList.map((item:FijosCorridosBet) => (
          <View key={item.id} style={styles.fijoRow}>
            <BetCircle value={item.bet.toString().padStart(2, '0')}/>
            
           {item.fijoAmount && <AmountCircle amount={item.fijoAmount} />}
           {item.corridoAmount && <AmountCircle amount={item.corridoAmount} />}
          </View>
          
        ))}
        <View key={`add-row-${Math.random().toString(36).substr(2, 9)}`} style={styles.fijoRow}>
            <BetCircle value={"+"} onPress={handleAddBetPress}/>
            <AmountCircle amount={"$"} onPress={handleAmountCirclePress}/>
            <AmountCircle amount={"$"} onPress={handleAmountCirclePress}/>
          </View>
      </View>
      {showKeyboard()}
      {showAmountNumericKeyboard()}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    borderRightWidth: 1,
    borderRightColor: '#E8E8E8',
    flex: 1,
  },
  colFijos: {
    flex: 3,
    paddingHorizontal: Layout.spacing.xs,
  },
  columnContent: {
    paddingVertical: Layout.spacing.xs,
  },
  fijoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xs,
  },
  fijoBetText: {
    width: 30,
    textAlign: 'right',
    marginRight: Layout.spacing.xs,
  },
});