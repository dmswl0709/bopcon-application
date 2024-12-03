import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import SignUpForm from '../components/SignUpForm';
import { registerUser } from '../store/slices/authSlice'; // Redux 액션 연결

const SignUpScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (formData: { email: string; nickname: string; password: string }) => {
    setLoading(true);
    try {
      // Redux 액션을 통해 회원가입 요청 처리
      await dispatch(registerUser(formData)).unwrap();
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다!');
    } catch (error: any) {
      console.error('회원가입 실패:', error.message);
      Alert.alert('회원가입 실패', error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={handleSignUp} loading={loading} />;
};

export default SignUpScreen;
