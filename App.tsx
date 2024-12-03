import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store'; // Redux store import
import AppNavigator from './src/navigation/AppNavigator'; // 앱의 메인 네비게이션

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;