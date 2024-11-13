import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BOPCONLogo from "../assets/icons/BOPCONLogo.svg";

const LoginForm = () => {
  const navigation = useNavigation();

  // 회원가입 페이지로 이동
  const handleJoinClick = () => {
    navigation.navigate('SignUpScreen'); // 'Join' 화면으로 이동
  };

  // 메인 페이지로 이동
  const handleLogoClick = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoContainer} onPress={handleLogoClick}>
      <BOPCONLogo width={170} height={60}/>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="이메일"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.loginButton}>
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