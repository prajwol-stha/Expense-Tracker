import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo
import { DATABASE_ENDPOINT, MONGODB_API_KEY } from './config';
import FetchDetailsFromDb from './FetchDetails';

import StatementsScreen from './StatementsScreen';

import { useNavigation } from '@react-navigation/native';

const Homescreen = () => {
  const navigation = useNavigation();

  const [spentAmount, setSpentAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isConnected, setIsConnected] = useState(true); // State to track internet connection status

  const handleRefresh = () => {
    if (!isConnected) {
      // Handle offline state
      Alert.alert('No Internet Connection', 'Please connect to the internet to refresh.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

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

  const saveExpense = async () => {
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
  
    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
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
            date: formattedDate, // Add the formatted date to the document
          },
        },
        {
          headers: {
            'apiKey': MONGODB_API_KEY,
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        Alert.alert('Database Updated', `Added Nrs ${parseFloat(spentAmount)} to database on ${formattedDate}.`, [
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
      // Handle offline state
      Alert.alert('No Internet Connection', 'Please connect to the internet to view the statement.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

    navigation.navigate('StatementsScreen');
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
