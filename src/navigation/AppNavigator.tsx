import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'; // Redux Provider 추가
import store from '../store'; // Redux Store import
import { StatusBar } from 'expo-status-bar';
import AppNavigationParamList from './AppNavigatorParamList';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import LoginScreen from '../screens/LoginScreen';
import ContentCategoryScreen from '../screens/ContentCategoryScreen';
import ContentScreen from '../screens/ContentScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConcertScreen from '../screens/ConcertScreen';
import SetListScreen from '../screens/SetListScreen';
import ArtistScreen from '../screens/ArtistScreen';
import PastSetListScreen from '../screens/PastsetlistScreen';
import MyPageScreen from '../screens/MyPageScreen';


const Stack = createStackNavigator<AppNavigationParamList>();

const AppNavigator = () => {
  return (
    <Provider store={store}>
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
          <Stack.Screen name="SetListScreen" component={SetListScreen} />
          <Stack.Screen name="ArtistScreen" component={ArtistScreen} />
          <Stack.Screen name="MyPageScreen" component={MyPageScreen} />

        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;