import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../store/slices/authSlice';
import BOPCONLogo from '../assets/icons/BOPCONLogo.svg';

export interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await dispatch(loginUser(data)).unwrap();
      console.log('로그인 성공 응답:', response);

      const { token, user } = response;

      try {
        // Save to AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userNickname', user);

        Alert.alert(`환영합니다, ${user}님!`);
        navigation.navigate('HomeScreen');
      } catch (storageError) {
        console.error('AsyncStorage 저장 오류:', storageError);
        Alert.alert('오류', '로그인 정보를 저장하는 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      // console.error('로그인 실패:', error.message || error);
      Alert.alert('로그인 실패', error.message || '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.logoContainer}>
        <BOPCONLogo width={150} height={80} />
      </TouchableOpacity>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: '이메일을 입력하세요.' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요."
                placeholderTextColor="#999"
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: '비밀번호를 입력하세요.' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요."
                placeholderTextColor="#999"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(handleLogin)}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>로그인</Text>}
        </TouchableOpacity>
      </View>

      {/* Sign-Up Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>아직 회원이 아니신가요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signUpLink}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 12,
    color: '#a7a7a7',
  },
  signUpLink: {
    fontSize: 12,
    color: 'blue',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
