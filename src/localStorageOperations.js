import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const handleSaveToLocalStorage = async (spentAmount, remarks) => {
  if (spentAmount.trim() === '' || remarks.trim() === '') {
    Alert.alert('Saving to local storage failed', 'Please enter both spent amount and remarks.');
    return;
  }

  try {
    const expenseData = {
      spent: spentAmount,
      remarks: remarks,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    const allKeys = await AsyncStorage.getAllKeys();
    const currentId = `localData${allKeys.length}`;

    await AsyncStorage.setItem(`${currentId}`, JSON.stringify(expenseData));
    console.log('Expense data saved to local storage:', expenseData);
  } catch (error) {
    console.error('Error saving expense data to local storage:', error.message);
  }
};

export const handleGetLocalData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const filteredKeys = allKeys.filter(key => key !== 'appTheme');
      console.log('All keys in local storage:', allKeys);
      console.log('All keys in local storage (excluding appTheme):', filteredKeys);
  
      if (filteredKeys.length > 0) {
        const allData = await AsyncStorage.multiGet(filteredKeys);
        const allDataObject = Object.fromEntries(
          allData.map(([key, value]) => [key, JSON.parse(value)])
        );
        console.log('All data in local storage (excluding appTheme):', allDataObject);
      } else {
        console.log('No relevant data found in local storage.');
      }
    } catch (error) {
      console.error('Error fetching local data:', error.message);
    }
  };

export const handleClearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Local storage cleared successfully.');
  } catch (error) {
    console.error('Error clearing local storage:', error.message);
  }
};