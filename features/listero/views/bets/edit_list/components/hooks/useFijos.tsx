import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { FijosCorridosBet } from '@/types';
import { GameTypes, AnnotationType, AnnotationTypes, GameTypeCodes } from '@/constants/Bet';
import { Alert } from 'react-native'; // Import Alert for modal simulation

// Helper to generate random string ID
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

/**
 * Custom hook to manage the state for Fijos/Corridos input,
 * including showing the numeric keyboard and handling bet numbers/amounts.
 */
export const useFijosParlet = ({
    onSelectPlay
}:any) => {
  const [showBetKeyboard, setShowBetKeyboard] = useState(false);
  const [showAmountKeyboard, setShowAmountKeyboard] = useState(false);

  const [fijosCorridosList, setFijosCorridos] = useState<FijosCorridosBet[]>([]);
  const [currentBetInput, setBetCurrentInput] = useState('');
  const [currentAmountInput, setCurrentAmountInput] = useState('');
  const [betBuffer, setBetBuffer] = useState<number[]>([]); // Store bet numbers (type number)
  const [activeAnnotationType, setActiveAnnotationType] = useState<AnnotationType | null>(null);
  const [activeGameType, setActiveGameType] = useState<GameTypeCodes | null>(null);
  const [editingBetId, setEditingBetId] = useState<string | null>(null); // Track which bet's amount is being edited
  const [editingAmountType, setEditingAmountType] = useState<'fijo' | 'corrido' | null>(null); // Track which amount type

  // Debugging useEffect
  useEffect(() => {
    console.log('Bet Buffer changed:', betBuffer);
  }, [betBuffer]);
  
  useEffect(() => {
    console.log('Fijos List changed:', fijosCorridosList.length);
    console.log('Active Annotation Type changed:', activeAnnotationType);
    (fijosCorridosList.length>0)? onSelectPlay(fijosCorridosList) : null
  }, [fijosCorridosList]);


  /**
   * Handles the press event on the '+' BetCircle.
   */
  const handleAddBetPress = useCallback(() => {
    setActiveAnnotationType(AnnotationTypes.Bet);
    setActiveGameType(GameTypes.FIJOS_CORRIDOS);
    setBetCurrentInput('');
    setShowBetKeyboard(true);
    setShowAmountKeyboard(false); // Ensure amount keyboard is hidden
  }, []);

  /**
   * Handles the press event on an AmountCircle.
   */
  const handleAmountCirclePress = (betId: string, amountType: 'fijo' | 'corrido') => {
    console.log(`Editing amount for bet ${betId}, type: ${amountType}`);

    setEditingBetId(betId);
    setEditingAmountType(amountType);
    setActiveAnnotationType(AnnotationTypes.Amount);
    setActiveGameType(GameTypes.FIJOS_CORRIDOS); // Assuming amounts are for fijos/corridos
    setCurrentAmountInput(''); // Reset amount input
    setShowAmountKeyboard(true);
    setShowBetKeyboard(false); // Ensure bet keyboard is hidden
  };

  const splitStringToPairs = (inputString: string): string[] => {
    const pairs: string[] = [];
    // Itera hasta el múltiplo de 2 más grande que sea menor o igual a la longitud de la cadena
    for (let i = 0; i < inputString.length - (inputString.length % 2); i += 2) {
      pairs.push(inputString.substring(i, i + 2));
    }
    return pairs;
  };
  /**
   * Processes digit input when the BET keyboard is active.
   */

  const handleDigitPress = useCallback((digit: string) => {
    const maxLength = 2;
    if (digit.length === maxLength) {
      const betNumber = parseInt(digit, 10);
      const newBet: FijosCorridosBet = {
        id: generateRandomId(),
        bet: betNumber,
        fijoAmount: null,
        corridoAmount: null,
      };
      setFijosCorridos(prevList => [...prevList, newBet]);
      setBetBuffer(prevBuffer => [...prevBuffer, betNumber]); // Add bet number to buffer
      setBetCurrentInput(''); // Reset for next bet input
      // Keep keyboard open for potentially more bets
    }
  },[]);

  const handleBetKeyboardInput = useCallback((digit: string) => {
    console.log(`activeAnnotationType input: ${activeAnnotationType}`);
    if (activeAnnotationType !== AnnotationTypes.Bet || activeGameType !== GameTypes.FIJOS_CORRIDOS) return;

    //    setBetCurrentInput(updatedInput);
    const list = splitStringToPairs(digit);
    list.forEach((digit) => {
      handleDigitPress(digit);
    });
    hideBetKeyboard();
    
  }, [activeAnnotationType, activeGameType, currentBetInput]);

  /**
   * Processes digit input when the AMOUNT keyboard is active.
   */
  const handleAmountKeyboardInput = (digit: string) => {
    setCurrentAmountInput(digit);
    
    finalizeAmountInput(digit);
    setCurrentAmountInput('');
    setShowAmountKeyboard(false);
    setEditingBetId(null);
    setEditingAmountType(null);
    setActiveAnnotationType(null);
  };


  /**
   * Applies the entered amount to a single bet.
   */
  const applyAmountToSingleBet = useCallback((betId: string | null, amountType: 'fijo' | 'corrido' | null, amount: number) => {
    if (!betId || !amountType) return;
    setFijosCorridos(prevList =>
      prevList.map(bet =>
        bet.id === betId
          ? { ...bet, [amountType === 'fijo' ? 'fijoAmount' : 'corridoAmount']: amount }
          : bet
      )
    );
    //onSelectPlay(fijosCorridosList)
  }, []);

  /**
   * Applies the entered amount to all bets in the buffer.
   */
  const applyAmountToBufferedBets = useCallback((amountType: 'fijo' | 'corrido' | null, amount: number) => {
    if (!amountType || betBuffer.length === 0) return;
    setFijosCorridos(prevList =>
      prevList.map(bet =>
        betBuffer.includes(bet.bet) // Check if the bet number is in the buffer
          ? { ...bet, [amountType === 'fijo' ? 'fijoAmount' : 'corridoAmount']: amount }
          : bet
      )
    );
   // onSelectPlay(fijosCorridosList)

  }, [betBuffer]);


  /**
   * Finalizes amount entry, checks buffer, and potentially shows confirmation.
   */
  const finalizeAmountInput = (amount:string) => {
    
    console.log(activeAnnotationType,editingAmountType,currentAmountInput)
    if (activeAnnotationType !== AnnotationTypes.Amount || !editingAmountType || amount === '') return;

    const amountValue = parseInt(amount, 10);
    if (isNaN(amountValue)) return; // Invalid amount

    const applyAmount = (applyToAll: boolean) => {
        if (applyToAll) {
            applyAmountToBufferedBets(editingAmountType, amountValue);
        } else {
            // Apply only to the one being edited explicitly
            applyAmountToSingleBet(editingBetId, editingAmountType, amountValue);
        }
        
    };

    if (betBuffer.length > 1) {
      // Show modal confirmation (using Alert for simplicity)
      Alert.alert(
        "Confirmar Monto",
        `Desea colocar ${amountValue} a todos los números anteriores en ${editingAmountType === 'fijo' ? GameTypes.FIJO : GameTypes.CORRIDO}?`,
        [
          { text: "Cancelar", onPress: () => applyAmount(false), style: "cancel" },
          { text: "Sí", onPress: () => applyAmount(true) }
        ]
      );
    } else {
      // If buffer has 0 or 1 item, just apply to the currently edited bet
      applyAmount(false); // Apply to single bet
    }
  };


  /**
   * Hides the BET numeric keyboard and resets bet input context.
   */
  const hideBetKeyboard = useCallback(() => {
    setShowBetKeyboard(false);
    setBetCurrentInput('');
    // Don't reset activeAnnotationType if user might switch to amount
  }, []);

  const hideAmountKeyboard = useCallback(() => {
    setShowAmountKeyboard(false);
    setCurrentAmountInput('');
    // Don't reset activeAnnotationType if user might switch to amount
  }, []);

  /**
   * Hides the AMOUNT numeric keyboard and resets amount input context.
   * This function effectively finalizes the amount input.
   */
 


  return {
    fijosCorridosList,
    showBetKeyboard,
    showAmountKeyboard, // Renamed state for clarity
    handleAddBetPress,
    handleAmountCirclePress,
    hideBetKeyboard,
    hideAmountKeyboard,
    handleBetKeyboardInput, // Renamed function for clarity
    handleAmountKeyboardInput,
    // Removed handleAmount as finalizeAmountInput covers the logic
  };
};