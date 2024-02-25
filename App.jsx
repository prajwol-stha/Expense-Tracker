import { View, Text } from 'react-native'
import React from 'react'

import Homescreen from './src/Homescreen';
import StatementsScreen from './src/StatementsScreen';

import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

const Stack=createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Homescreen" component={Homescreen}/>
        <Stack.Screen name="StatementsScreen" component={StatementsScreen}/>
      </Stack.Navigator>
    </NavigationContainer >
  )
}

export default App

