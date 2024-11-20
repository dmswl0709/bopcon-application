import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/slices/authSlice';
import { login } from '../apis/auth.api';
import BOPCONLogo from '../assets/icons/BOPCONLogo.svg';

const LoginForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 회원가입 페이지로 이동
  const handleJoinClick = () => {
    navigation.navigate('SignUpScreen'); // 'SignUpScreen' 화면으로 이동
  };

  // 메인 페이지로 이동
  const handleLogoClick = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  // 로그인 처리
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await login({ email, password });
      // Redux 상태 업데이트
      dispatch(
        loginAction({
          token: response.accessToken,
          refreshToken: response.refreshToken,
          nickname: response.nickname,
        })
      );
      Alert.alert('로그인 성공!', `환영합니다, ${response.nickname}님!`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error: any) {
      Alert.alert(
        '로그인 실패',
        error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoContainer} onPress={handleLogoClick}>
        <BOPCONLogo width={170} height={60} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="이메일"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>아직 회원이 아니신가요?</Text>
        <TouchableOpacity onPress={handleJoinClick}>
          <Text style={styles.signupLink}>이메일 회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const inputSpacing = 25; // 이메일 인풋과 비밀번호 인풋 사이의 간격
const buttonSpacing = 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '80%',
    marginBottom: inputSpacing, // 이메일/비밀번호 인풋 사이 간격 설정
  },
  input: {
    height: 65,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    width: '80%',
    height: 70,
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: buttonSpacing, // 비밀번호 인풋과 로그인 버튼 사이 간격 설정
  },
  loginButtonText: {
    color: '#000',
    fontSize: 15,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#a7a7a7',
    fontSize: 12,
  },
  signupLink: {
    color: '#000',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default LoginForm;