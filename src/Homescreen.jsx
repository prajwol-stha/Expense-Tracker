import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { DATABASE_ENDPOINT, MONGODB_API_KEY } from './config';
import FetchDetailsFromDb from './FetchDetails';


const App = () => {
  const [spentAmount, setSpentAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const spent=123;
  const [data,setData]=useState(null)

  const handleRefresh = () => {
    setSpentAmount('');
    setRemarks('');
  };
  

  const saveExpense = async () => {
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
  async function handleStatement(){
    console.log('handling');
    // FetchDetailsFromDb();
    try {
      const details = await FetchDetailsFromDb();
      console.log(details);
    } catch (error) {
      console.error('Error fetching user contributions:', error);
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
      <TouchableOpacity onPress={saveExpense} style={styles.btn}>
        <Text style={styles.btnText}>Save Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRefresh} style={styles.btn}>
        <Text style={styles.btnText}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleStatement} style={styles.btn}>
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
    width:320,
    alignSelf:'center',
    borderColor:'#25C120'
  },
  btn: {
    backgroundColor: '#25C120',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 5,
    width:180,
    alignSelf:'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;


