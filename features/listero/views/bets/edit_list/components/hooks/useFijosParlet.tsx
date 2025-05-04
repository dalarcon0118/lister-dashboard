import { useEffect, useState } from 'react';
import { FijosCorridosBet } from '@/types';
import { GameTypes, AnnotationType, AnnotationTypes, GameTypeCodes } from '@/constants/Bet'; // Added AnnotationTypes

// Helper to generate random string ID
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

/**
 * Custom hook to manage the state for Fijos/Corridos input,
 * including showing the numeric keyboard and handling bet numbers/amounts.
 */
export const useFijosParlet = () => {
  const [showNumericKeyboard, setShowNumericKeyboard] = useState(false);
  const [showAmountNumericKeyboardState, setShowAmountNumericKeyboard] = useState(false);

  const [fijosCorridosList, setFijosCorridos] = useState<FijosCorridosBet[]>([]);
  const [isRangeMode, setIsRangeMode] = useState(false); // Keep range mode state if needed
  const [currentBetInput, setBetCurrentInput] = useState('');
  const [currentAmountInput, setCurrentAmountInput] = useState('');
  const [betBuffer, setBetBuffer] = useState<any>([]);
  const [activeAnnotationType, setActiveAnnotationType] = useState<AnnotationType | null>(null);
  const [activeGameType, setActiveGameType] = useState<GameTypeCodes | null>(null);
  // const [editingBetId, setEditingBetId] = useState<string | null>(null); // State for tracking amount editing context
    useEffect(() => {
      console.log('fijosCorridosList changed:', currentAmountInput);
    }, [currentAmountInput]);
  /**
   * Handles the press event on the '+' BetCircle.
   * Sets the state to show the numeric keyboard for adding a new bet number.
   */
  const handleAddBetPress = () => {
    setActiveAnnotationType(AnnotationTypes.Bet);
    setActiveGameType(GameTypes.FIJOS_CORRIDOS); // Set context for FIJOS_CORRIDOS bet input
    setBetCurrentInput(''); // Reset input for the new bet
    setShowNumericKeyboard(true);
  };


  /**
   * Handles the press event on an AmountCircle.
   * Sets the state to show the numeric keyboard for adding/editing an amount.
   * NOTE: Full implementation requires tracking which bet/amount type is active.
   */
  const handleAmountCirclePress = () => {
    setActiveAnnotationType(AnnotationTypes.Amount);
    setActiveGameType(GameTypes.FIJOS_CORRIDOS); // Set context for FIJOS_CORRIDOS bet input
    setCurrentAmountInput(''); // Reset input for the new bet
    setShowAmountNumericKeyboard(true);
    console.log("handleAmountCirclePress called");
  };



  const handleAmount = () => {
    
  }
  /**
   * Processes the digit pressed on the NumericKeyboard based on the active context.
   * If adding a 'bet' for 'fijos_corridos', it creates a new entry when 2 digits are entered.
   * @param digit The digit pressed ('0'-'9').
   */
  const handleFijosBet = (digit: string) => {
    console.log("handleFijosBet called with digit:", digit);
    // Ensure we have context on what is being inputted
    if (!activeAnnotationType || !activeGameType) return;

    
    const updatedInput = currentBetInput + digit;
    setBetCurrentInput(updatedInput); 
    console.log("Updated input:", updatedInput);
    
  console.log(activeAnnotationType,activeGameType);

    // Logic for handling 'bet' input
    if (activeAnnotationType === AnnotationTypes.Bet && activeGameType === GameTypes.FIJOS_CORRIDOS) {
      const maxLength = 2; // Fijos/Corridos bets are 2 digits
      if (updatedInput.length === maxLength) {
        // Create the new bet object once 2 digits are entered
        const newBet: FijosCorridosBet = {
          id: generateRandomId(), // Generate a random ID
          bet: parseInt(updatedInput, 10), // Parse the 2-digit number
          fijoAmount: null, // Initialize amounts as null (empty)
          corridoAmount: null,
        };
        // Add the new bet to the list
        setFijosCorridos(prevList => [...prevList, newBet]);

        setBetBuffer((prevBuffer:any) => [...prevBuffer, newBet.bet]);

        console.log("New bet added:", fijosCorridosList);
        // Reset state for next input
        setBetCurrentInput('');
        //setShowNumericKeyboard(false); // Hide keyboard
       // setActiveAnnotationType(null); // Clear context
      }
    }
    // Logic for handling 'amount' input (Placeholder)
    else if (activeAnnotationType === AnnotationTypes.Amount) {
      // TODO: Implement amount input logic
      // - Check max length based on GameTypeLimits
      // - Find the bet using editingBetId
      // - Update the correct amount (fijoAmount or corridoAmount)
      // - Reset state, hide keyboard etc.
      console.log("Amount input:", updatedInput);
    }
  };


  /**
   * Hides the numeric keyboard and resets the input context.
   */
  const hideNumericKeyboard = () => {
    setShowNumericKeyboard(false);
    setBetCurrentInput('');
    setActiveAnnotationType(null);
    setActiveGameType(null);
  };

  const hideAmountNumericKeyboard = () => {
    setShowNumericKeyboard(false);
    setBetCurrentInput('');
    setActiveAnnotationType(null);
    setActiveGameType(null);
  };


  return {
    fijosCorridosList,
    isRangeMode,
    showNumericKeyboard,
    handleAddBetPress, // Handler for the '+' BetCircle
    handleAmountCirclePress, // Handler for AmountCircles
    hideNumericKeyboard,
    hideAmountNumericKeyboard,
    handleAmount,
    showAmountNumericKeyboardState,
    handleFijosBet, // Handler for NumericKeyboard input
  };
};