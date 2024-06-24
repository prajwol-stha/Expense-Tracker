
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ThemeToggle from './ThemeToggle';
import { saveExpenseToDb, handleLocalToDatabase } from './databaseOperations';
import { handleSaveToLocalStorage, handleGetLocalData, handleClearLocalStorage } from './localStorageOperations';
import { styles } from './styles';



const Homescreen = () => {
  const navigation = useNavigation();
  const [spentAmount, setSpentAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const handleRefresh = () => {
    setSpentAmount('');
    setRemarks('');
  };

  const handleStatement = () => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Please connect to the internet to view the statement.');
      return;
    }
    navigation.navigate('StatementsScreen');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount spent"
        value={spentAmount}
        onChangeText={setSpentAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Remarks"
        value={remarks}
        onChangeText={setRemarks}
        style={styles.input}
      />
      {isConnected ? (
        <>
          <TouchableOpacity onPress={() => saveExpenseToDb(spentAmount, remarks)} style={styles.btn}>
            <Text style={styles.btnText}>Save Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh} style={styles.btn}>
            <Text style={styles.btnText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStatement} style={styles.btn}>
            <Text style={styles.btnText}>View Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLocalToDatabase} style={styles.btn}>
            <Text style={styles.btnText}>Update Database</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => handleSaveToLocalStorage(spentAmount, remarks)} style={[styles.btn, styles.btnOffline]}>
            <Text style={styles.btnText}>Save to local storage</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGetLocalData} style={[styles.btn, styles.btnOffline]}>
            <Text style={styles.btnText}>Get Local Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearLocalStorage} style={[styles.btn, styles.btnOffline]}>
            <Text style={styles.btnText}>Clear Storage</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={{ alignSelf: 'center' }}>
        <ThemeToggle />
      </View>
    </View>
  );
};

export default Homescreen;


