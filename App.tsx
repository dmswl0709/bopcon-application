import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/store'; // Redux store import
import AppNavigator from './src/navigation/AppNavigator'; // 앱의 메인 네비게이션
import { useDispatch } from 'react-redux';
import { setAuthState, logout } from './src/store/slices/authSlice'; // 액션 추가

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // AsyncStorage에서 토큰과 사용자 정보를 가져옵니다.
        const token = await AsyncStorage.getItem('authToken');
        const nickname = await AsyncStorage.getItem('userNickname');

        if (token && nickname) {
          // 유효성 검증을 위해 토큰을 서버에 확인하는 로직 추가 가능
          // 예를 들어:
          // const isValid = await validateToken(token); // 토큰 검증 API 호출
          // if (isValid) {
          //   dispatch(setAuthState({ token, nickname }));
          // } else {
          //   await AsyncStorage.clear();
          //   dispatch(logout());
          // }

          // 현재는 토큰이 존재한다고 가정
          dispatch(setAuthState({ token, nickname }));
        } else {
          console.log('No token found. User is not logged in.');
        }
      } catch (error) {
        console.error('Error loading auth state from AsyncStorage:', error);
        // 필요하면 AsyncStorage를 초기화하거나 Redux 상태를 로그아웃 상태로 설정
        await AsyncStorage.clear();
        dispatch(logout());
      }
    };

    initializeAuth(); // 초기화 함수 실행
  }, [dispatch]);

  return <AppNavigator />;
};

const App = () => (
  <Provider store={store}>
    <AppInitializer />
  </Provider>
);

export default App;
