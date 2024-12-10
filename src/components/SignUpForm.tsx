import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/slices/authSlice'; // Redux 액션
import BOPCONLogo from '../assets/icons/BOPCONLogo.svg';

const SignUpForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      // Redux 액션 디스패치
      const response = await dispatch(registerUser({ email, nickname, password })).unwrap();
      Alert.alert('회원가입 성공!', `환영합니다, ${response.user.nickname}님!`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error: any) {
      console.error('[회원가입 실패]:', error);
      Alert.alert('회원가입 실패', error || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoContainer} onPress={() => navigation.navigate('HomeScreen')}>
        <BOPCONLogo width={170} height={60} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput placeholder="이메일" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="닉네임" style={styles.input} value={nickname} onChangeText={setNickname} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="비밀번호" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="비밀번호 확인" secureTextEntry style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  inputContainer: {
    width: '80%',
    marginBottom: 25,
  },
  input: {
    height: 65,
    borderWidth: 1,
    borderColor: '#9D9D9D',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  signupButton: {
    width: '80%',
    height: 70,
    backgroundColor: '#000',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SignUpForm;
