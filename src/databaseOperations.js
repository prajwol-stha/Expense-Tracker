
import axios from 'axios';
import { Alert } from 'react-native';
import { DATABASE_ENDPOINT, MONGODB_API_KEY } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveExpenseToDb = async (spentAmount, remarks) => {
  if (spentAmount.trim() === '' || remarks.trim() === '') {
    Alert.alert('Database Update Failed', 'Please enter both spent amount and remarks.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  try {
    const response = await axios.post(
      DATABASE_ENDPOINT,
      {
        dataSource: 'Cluster0',
        database: 'expenses',
        collection: 'amount',
        document: {
          spent: parseFloat(spentAmount),
          remarks: remarks,
          date: currentDate,
        },
      },
      {
        headers: {
          apiKey: MONGODB_API_KEY,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      Alert.alert('Database Updated', `Added Nrs ${parseFloat(spentAmount)} to database on ${currentDate}.`);
      console.log('Expense saved successfully:', response.data);
    } else {
      console.error('Error saving expense. Unexpected status code:', response.status);
    }
  } catch (error) {
    console.error('Error saving expense:', error.message);
  }
};

export const handleLocalToDatabase = async () => {
  console.log('Uploading data to database from local storage...');
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const filteredKeys = allKeys.filter(key => key !== 'appTheme');
    console.log('All keys in local storage:', allKeys);
    console.log('All keys in local storage (excluding appTheme):', filteredKeys);

    if (filteredKeys.length > 0) {
      const allData = await AsyncStorage.multiGet(filteredKeys);

      const extractedData = allData.map(([key, value]) => {
        const parsedValue = JSON.parse(value);
        const { date, remarks, spent } = parsedValue;
        saveExpenseToDb(spent, remarks, date);
        return { date, remarks, spent };
      });

      console.log('Local storage data uploaded to database:', extractedData);
      AsyncStorage.clear();
    } else {
      console.log('No data found in local storage.');
      Alert.alert('Local Storage is empty.');
    }
  } catch (error) {
    console.error('Error fetching local data:', error.message);
  }
};

