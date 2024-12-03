import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import LoginForm from '../components/LoginForm';
import { loginUser } from '../store/slices/authSlice'; // Redux 액션 연결

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Redux 액션을 통해 로그인 요청 처리
      await dispatch(loginUser(credentials)).unwrap();
      Alert.alert('로그인 성공', '환영합니다!');
    } catch (error: any) {
      console.error('로그인 실패:', error.message);
      Alert.alert('로그인 실패', error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} />;
};

export default LoginScreen;
