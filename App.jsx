import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import Homescreen from './src/Homescreen';
import StatementsScreen from './src/StatementsScreen';
import { ThemeProvider, ThemeContext } from './src/ThemeContext';

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
};

const darkTheme = {
  background: '#000000',
  text: '#ffffff',
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={currentTheme}>
      <Container>
        <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Homescreen" component={Homescreen} />
            <Stack.Screen name="StatementsScreen" component={StatementsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Container>
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
