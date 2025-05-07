import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/typography/StyledText';
import Layout from '@/constants/Layout';
import Colors from '@/constants/Colors';
import AmountCircle from './AmountCircle';
import BetCircle from './BetCircle';
import { FijosCorridosBet } from '@/types';
import { useParlet } from './hooks/useParlet';
import BottomDrawer from '@/components/ui/BottomDrawer';
import NumericKeyboard from './NumericKeyboard';

interface ParletBet {
  id: string;
  bets: number[];
  amount: number;
}

interface ParletColumnProps {
  fijosCorridosList:FijosCorridosBet[];
}

export default function ParletColumn({ fijosCorridosList }: ParletColumnProps) {
  const { 
    promptToAddAsParlet, 
    potentialParletNumbers } = useParlet();

  const [parletList, setParletList] = useState<ParletBet[]>([]);

  const renderKeyboard = () => {
  
    return (
      <BottomDrawer isVisible={isVisible} onClose={onClose} title='' height={"50%"}>
       
        <NumericKeyboard
          onNumberPress={(number:string)=>{
            onNumberPress(number); 

          }} // Pass the correct handler
          annotationType={annotationType}
          gameType={GameTypes.FIJOS_CORRIDOS} // Assuming this column is always for this type
        />
        {/* Optionally add a "Done" button here for the amount keyboard */}
      </BottomDrawer>
    );
  };
  
 
  return (
    <View style={[styles.column, styles.colParlet]}>
      <View style={styles.columnContent}>
        {parletList.map((item) => (
          <View key={item.id} style={styles.parletBlock}>
            <View style={styles.parletNumbers}>
              <BetCircle  value= {"+"} onPress={()=>promptToAddAsParlet(fijosCorridosList)}/>
            </View>
            <AmountCircle amount={item.amount} />
          </View>
        ))}
      </View>
      <View style={styles.columnContent}>
        {parletList.map((item) => (
          <View key={item.id} style={styles.parletBlock}>
            <View style={styles.parletNumbers}>
              <BetCircle  value= {"+"} onPress={()=>{}}/>
            </View>
            <AmountCircle amount={item.amount} />
          </View>
        ))}
      </View>

      <View style={styles.columnContent}>
       
          <View key={`add-row-${Math.random().toString(36).substr(2, 9)}`}  style={styles.parletBlock}>
            <View style={styles.parletNumbers}>
              <BetCircle  value= {"+"} onPress={()=>{}}/>
            </View>
            <AmountCircle amount={"$"} />
          </View>
      </View>
    </View>
  );
}
/*{item.bets.map((bet, index) => (
                 <BetCircle key={index} value= {"+"} onPress={()=>{}}/>
                
              ))}*/

const styles = StyleSheet.create({
  column: {
    borderRightWidth: 1,
    borderRightColor: Colors.light.border,
    flex: 1,
  },
  colParlet: {
    flex: 2,
    paddingHorizontal: Layout.spacing.xs,
  },
  columnContent: {
    paddingVertical: Layout.spacing.xs,
  },
  parletBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xs,
    minHeight: 60,
  },
  parletNumbers: {
    flex: 1,
    marginRight: Layout.spacing.xs,
  },
  parletBetText: {
    marginBottom: Layout.spacing.xxs,
  },
});