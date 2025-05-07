import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { FijosCorridosBet, ParletBet } from '@/types';

// Helper to generate random string ID, if needed for new ParletBet
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

interface ParletState {
  isParletModalVisible: boolean;
  potentialParletNumbers: number[];
  isParletDrawerVisible: boolean;
  fromFijosyCorridoBet: boolean; // To track if the flow started from Fijos/Corridos
  // newParletBet: ParletBet | null; // Optional: store the confirmed Parlet bet

  // Actions
  promptToAddAsParlet: (fijosCorridosBets: FijosCorridosBet[]) => void;
  confirmParletBet: () => void;
  cancelParletBet: () => void;
  closeParletDrawer: () => void; // Action to close the drawer manually if needed
}

const useParletStore = create<ParletState>((set, get) => ({
  isParletModalVisible: false,
  potentialParletNumbers: [],
  isParletDrawerVisible: false,
  fromFijosyCorridoBet: false,
  // newParletBet: null,

  promptToAddAsParlet: (fijosCorridosBets) => {
    if (!fijosCorridosBets || fijosCorridosBets.length === 0) {
      console.log('No bets provided to form a Parlet.');
      return;
    }
    const extractedNumbers = fijosCorridosBets
      .map(bet => bet.bet)
      .filter((value, index, self) => self.indexOf(value) === index); // Unique numbers

    if (extractedNumbers.length < 2) {
      Alert.alert("Parlet Bet", "A Parlet bet requires at least two unique numbers.");
      return;
    }

    set({
      potentialParletNumbers: extractedNumbers,
      isParletModalVisible: true,
      fromFijosyCorridoBet: true, // Mark that flow started from Fijos/Corridos
      isParletDrawerVisible: false, // Ensure drawer is closed when modal opens
    });
  },

  confirmParletBet: () => {
    const { potentialParletNumbers } = get();
    if (potentialParletNumbers.length > 0) {
      // Example: Create a new ParletBet object
      // const createdParlet: ParletBet = {
      //   id: generateRandomId(),
      //   bets: potentialParletNumbers,
      //   amount: 0, // Default amount, or prompt user for amount
      // };
      // set({ newParletBet: createdParlet });
      console.log('Parlet bet confirmed with numbers:', potentialParletNumbers);
      // Here, you would typically call a function to add `createdParlet` to your list of Parlet bets.
    }
    set({
      isParletModalVisible: false,
      potentialParletNumbers: [],
      fromFijosyCorridoBet: false, // Reset flow origin
    });
  },

  cancelParletBet: () => {
    const wasFromFijos = get().fromFijosyCorridoBet;
    console.log('Adding Parlet bet cancelled.');
    set(state => ({
      isParletModalVisible: false,
      potentialParletNumbers: [],
      fromFijosyCorridoBet: false, // Reset flow origin
      // If cancelled and it was from Fijos/Corridos flow, open the Parlet drawer
      isParletDrawerVisible: wasFromFijos ? true : state.isParletDrawerVisible,
    }));
  },
  closeParletDrawer: () => {
    set({ isParletDrawerVisible: false });
  }
}));

/**
 * Custom hook to manage the process of creating a Parlet bet
 * from a list of FijosCorridosBet numbers, using Zustand for state.
 */
export const useParlet = () => {
  const {
    isParletModalVisible,
    potentialParletNumbers,
    isParletDrawerVisible,
    promptToAddAsParlet,
    confirmParletBet,
    cancelParletBet,
    closeParletDrawer
    // newParletBet, // Uncomment if you use this
  } = useParletStore();

  // Effect to show the Alert modal when isParletModalVisible and potentialParletNumbers are set
  useEffect(() => {
    if (isParletModalVisible && potentialParletNumbers.length > 0) {
      Alert.alert(
        "Add as Parlet Bet?",
        `Do you want to add the numbers [${potentialParletNumbers.join(', ')}] as a Parlet bet?`,
        [
          {
            text: "Cancel",
            onPress: cancelParletBet, // Action from Zustand store
            style: "cancel"
          },
          {
            text: "OK",
            onPress: confirmParletBet // Action from Zustand store
          }
        ]
      );
    }
  }, [isParletModalVisible, potentialParletNumbers, cancelParletBet, confirmParletBet]);

  return {
    isParletModalVisible,
    potentialParletNumbers,
    isParletDrawerVisible,
    promptToAddAsParlet,
    confirmParletBet,
    cancelParletBet,
    closeParletDrawer
    // newParletBet, // Uncomment if you use this
  };
};