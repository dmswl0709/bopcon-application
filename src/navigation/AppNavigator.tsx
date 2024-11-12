import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AppNavigationParamList from './AppNavigatorParamList';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import LoginScreen from '../screens/LoginScreen';
import ContentCategoryScreen from '../screens/ContentCategoryScreen';// MenuPage 경로에 맞게 수정
import NewContentScreen from '../screens/NewContentScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator<AppNavigationParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{headerShown: false}} >
        <Stack.Screen name="HomeScreen" component={HomeScreen}  />
        <Stack.Screen name="MenuScreen" component={MenuScreen} /> 
        <Stack.Screen name="LoginScreen" component={LoginScreen}/> 
        <Stack.Screen name="SignUpScreen" component={SignUpScreen}/> 
        <Stack.Screen name="NewContentScreen" component={NewContentScreen}/> 
        <Stack.Screen name="ContentCategoryScreen" component={ContentCategoryScreen}/> 
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default AppNavigator;
