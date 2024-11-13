import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AppNavigationParamList from './AppNavigatorParamList';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import LoginScreen from '../screens/LoginScreen';
import ContentCategoryScreen from '../screens/ContentCategoryScreen';
import NewContentScreen from '../screens/NewContentScreen';
import SignUpScreen from '../screens/SignUpScreen';

// 각 카테고리 페이지 임포트
import NEW from '../screens/New';
import ALL from '../screens/ALL';
import POP from '../screens/POP';
import ROCK from '../screens/ROCK';
import JPOP from '../screens/JPOP';
import HIPHOP from '../screens/HIPHOP';
import RnB from '../screens/RnB';

const Stack = createStackNavigator<AppNavigationParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} /> 
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="NewContentScreen" component={NewContentScreen} />
        <Stack.Screen name="ContentCategoryScreen" component={ContentCategoryScreen} />
        
        {/* 각 카테고리 화면 추가 */}
        <Stack.Screen name="NEW" component={NEW} />
        <Stack.Screen name="ALL" component={ALL} />
        <Stack.Screen name="POP" component={POP} />
        <Stack.Screen name="ROCK" component={ROCK} />
        <Stack.Screen name="JPOP" component={JPOP} />
        <Stack.Screen name="HIPHOP" component={HIPHOP} />
        <Stack.Screen name="RnB" component={RnB} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default AppNavigator;
