import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { DATABASE_ENDPOINT, MONGODB_API_KEY } from './config';
import FetchDetailsFromDb from './FetchDetails';

import StatementsScreen from './StatementsScreen';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Homescreen = () => {
  const navigation = useNavigation();

  const [spentAmount, setSpentAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  const handleRefresh = () => {
    setSpentAmount('');
    setRemarks('');
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const saveExpense = async (spentAmount, remarks, date) => {
    if (!isConnected) {
      // Handle offline state
      Alert.alert('No Internet Connection', 'Please connect to the internet to save expense.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }
    if (spentAmount.trim() === '' || remarks.trim() === '') {
      Alert.alert('Database Update Failed', 'Please enter both spent amount and remarks.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }
  
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
            date: date, 
          },
        },
        {
          headers: {
            'apiKey': MONGODB_API_KEY,
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Database Updated', `Added Nrs ${parseFloat(spentAmount)} to database on ${date}.`, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        console.log('Expense saved successfully:', response.data);
      } else {
        console.error('Error saving expense. Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('Error saving expense:', error.message);
    }
  };

  const handleStatement = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Please connect to the internet to view the statement.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

    navigation.navigate('StatementsScreen');
  };

  const handleSaveToLocalStorage = async () => {
    console.log("Local storage");
  
    if (spentAmount.trim() === '' || remarks.trim() === '') {
      Alert.alert('Saving to local storage failed', 'Please enter both spent amount and remarks.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
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
  
      // Current ID and use it as the key
      const allKeys = await AsyncStorage.getAllKeys();
      const currentId = `localData${allKeys.length}`;
  
      // Current ID is the key
      await AsyncStorage.setItem(`${currentId}`, JSON.stringify(expenseData));
      console.log('Expense data saved to local storage:', expenseData);
    } catch (error) {
      console.error('Error saving expense data to local storage:', error.message);
    }
  };
  
  const handleGetLocalData = async () => {
    console.log("Local storage Fetching");
  
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All keys in local storage:', allKeys);
  
      if (allKeys.length > 0) {
        const allData = await AsyncStorage.multiGet(allKeys);
        const allDataObject = {}; 
  
        allData.forEach(([key, value]) => {
          try {
            const parsedValue = JSON.parse(value);
            allDataObject[key] = parsedValue; 
          } catch (parseError) {
            console.error(`Error parsing data for key ${key}:`, parseError.message);
            console.log(`Raw value for key ${key}:`, value);
          }
        });
  
        console.log('All data in local storage:', allDataObject);
      } else {
        console.log('No data found in local storage.');
      }
    } catch (error) {
      console.error('Error fetching local data:', error.message);
    }
  };
  

  const handleClearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local storage cleared successfully.');
    } catch (error) {
      console.error('Error clearing local storage:', error.message);
    }
  };

  
  const handleUpdateDatabaseOnline = async () => {
    console.log('Uploading data to database from local storage...');
  
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All keys in local storage:', allKeys);
  
      if (allKeys.length > 0) {
        const allData = await AsyncStorage.multiGet(allKeys);
        const extractedData = []; 
        allData.forEach(([key, value]) => {
          try {
            const parsedValue = JSON.parse(value);
            const { date, remarks, spent } = parsedValue;
            saveExpense(spent, remarks, date); 
            extractedData.push({ date, remarks, spent });
          } catch (parseError) {
            console.error(`Error parsing data for key ${key}:`, parseError.message);
          }
        });
  
        console.log('Local storage data uploaded to database:', extractedData);
        AsyncStorage.clear();
      } else {
        console.log('No data found in local storage.');
      }
    } catch (error) {
      console.error('Error fetching local data:', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount spent"
        value={spentAmount}
        onChangeText={(text) => setSpentAmount(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Remarks"
        value={remarks}
        onChangeText={(text) => setRemarks(text)}
        keyboardType="default"
        style={styles.input}
      />
      <TouchableOpacity onPress={saveExpense} style={[styles.btn, !isConnected && styles.btnOffline]}>
        <Text style={styles.btnText}>Save Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRefresh} style={[styles.btn, !isConnected && styles.btnOffline]}>
        <Text style={styles.btnText}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleStatement} style={[styles.btn, !isConnected && styles.btnOffline]}>
        <Text style={styles.btnText}>View Statement</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSaveToLocalStorage} style={[styles.btn, styles.btnOffline]}>
        <Text style={styles.btnText}>Save to local storage</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpdateDatabaseOnline} style={[styles.btn]}>
        <Text style={styles.btnText}>Update Database</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGetLocalData} style={[styles.btn,styles.btnOffline]}>
        <Text style={styles.btnText}>Get Local Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleClearLocalStorage} style={[styles.btn,styles.btnOffline]}>
        <Text style={styles.btnText}>Clear Storage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: 320,
    alignSelf: 'center',
    borderColor: '#25C120',
  },
  btn: {
    backgroundColor: '#25C120',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 5,
    width: 180,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  btnOffline: {
    backgroundColor: 'red',
    borderColor: 'darkred',
  },
});

export default Homescreen;
