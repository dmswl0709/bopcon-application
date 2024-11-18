import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AppNavigationParamList from './AppNavigatorParamList';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import LoginScreen from '../screens/LoginScreen';
import ContentCategoryScreen from '../screens/ContentCategoryScreen';
import ContentScreen from '../screens/ContentScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConcertScreen from '../screens/ConcertScreen';
import PastSetListScreen from '../screens/PastsetlistScreen'; // Import PastSetListScreen

const Stack = createStackNavigator<AppNavigationParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="ContentScreen" component={ContentScreen} />
        <Stack.Screen name="ContentCategoryScreen" component={ContentCategoryScreen} />
        <Stack.Screen name="ConcertScreen" component={ConcertScreen} />
        <Stack.Screen name="PastSetListScreen" component={PastSetListScreen} /> 
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default AppNavigator;
