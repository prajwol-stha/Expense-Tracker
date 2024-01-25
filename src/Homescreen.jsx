import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import {DATABASE_ENDPOINT,MONGODB_API_KEY, CLUSTER_NAME,DATABASE_NAME,COLLECTION_NAME} from './config'

const App = () => {
  const [spentAmount, setSpentAmount] = useState('');
  const [remarks,setRemarks] = useState('');
  const saveExpense = async () => {
    try {
      const response = await axios.post(DATABASE_ENDPOINT, {
        dataSource: 'Cluster0',
        database: 'expenses',
        collection: 'amount',
        document: {
          spent: parseFloat(spentAmount),
        },
      }, {
        headers: {
          'apiKey': MONGODB_API_KEY,
        },
      });
  
      // Check for successful status codes (2xx range)
      if (response.status >= 200 && response.status < 300) {
        console.log('Expense saved successfully:', response.data);
      } else {
        console.error('Error saving expense. Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('Error saving expense:', error.message);
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Spent Amount</Text>
      <TextInput
        placeholder="Enter amount"
        value={spentAmount}
        onChangeText={(text) => setSpentAmount(text)}
        keyboardType="numeric"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
      />
      <Button title="Save Expense" onPress={saveExpense} />
    </View>
  );
};

export default App;
