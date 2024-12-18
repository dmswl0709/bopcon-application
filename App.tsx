import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/store'; // Redux store import
import AppNavigator from './src/navigation/AppNavigator'; // 앱의 메인 네비게이션
import { useDispatch } from 'react-redux';
import { logout } from './src/store/slices/authSlice'; // 로그아웃 액션 추가

// AppInitializer 컴포넌트
const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 저장된 키 목록을 가져온 뒤 개별적으로 삭제
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);

        console.log('[앱 초기화] AsyncStorage 초기화 완료');
        dispatch(logout()); // Redux 상태 초기화
        console.log('[Redux 상태 초기화 완료]');
      } catch (error) {
        console.error('[앱 초기화 오류 발생]:', error.message);
      }
    };

    initializeApp(); // 초기화 함수 실행
  }, [dispatch]);

  return <AppNavigator />;
};

// 최상위 App 컴포넌트
const App = () => (
  <Provider store={store}>
    <AppInitializer />
  </Provider>
);

export default App;