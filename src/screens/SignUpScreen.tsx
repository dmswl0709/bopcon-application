import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import BOPCONLogo from '../assets/icons/BOPCONLogo.svg';
import { signup } from '../apis/auth'; // Named export 사용

export interface JoinProps {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<JoinProps>();
  const [loading, setLoading] = useState(false);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null); // 비밀번호 일치 여부 상태 추가

  const passwordRules = [
    { text: '8자 이상, 15자 이하로 설정해 주세요.', check: password.length >= 8 && password.length <= 15 },
    { text: '특수 문자를 사용해 주세요.', check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: '동일한 문자가 4번 반복되면 안돼요.', check: !/(.)\1{3,}/.test(password) },
  ];

  const onSubmit = async (data: JoinProps) => {
    setLoading(true);
    try {
      console.log('회원가입 데이터:', data);

      const response = await signup({
        email: data.email.trim(),
        nickname: data.nickname.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword, // 추가
      });
      console.log('회원가입 성공:', response);

      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다!');
      navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
    } catch (error: any) {
      console.error('회원가입 실패:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      Alert.alert('회원가입 실패', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 확인 시, 일치 여부 확인
  const handlePasswordCheck = (value: string) => {
    setPasswordMatch(value === password); // 비밀번호와 일치하는지 확인
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.logoContainer}>
        <BOPCONLogo width={150} height={80} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: '이메일을 입력하세요.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '유효한 이메일 형식이 아닙니다.',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요."
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>닉네임</Text>
        <Controller
          control={control}
          name="nickname"
          rules={{
            required: '닉네임을 입력하세요.',
            minLength: {
              value: 3,
              message: '닉네임은 최소 3자 이상이어야 합니다.',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력하세요."
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.nickname && <Text style={styles.errorText}>{errors.nickname.message}</Text>}
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
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: '비밀번호를 확인하세요.',
            validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              secureTextEntry
              onChangeText={(value) => {
                onChange(value);
                handlePasswordCheck(value); // 비밀번호 확인일치 여부 체크
              }}
              value={value}
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
      </View>

      {/* 비밀번호 일치 여부 표시 */}
      {passwordMatch !== null && (
        <Text style={[styles.matchText, { color: passwordMatch ? 'green' : 'red' }]}>
          {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
        </Text>
      )}

      <View style={styles.rulesContainer}>
        {passwordRules.map((rule, index) => (
          <View key={index} style={styles.rule}>
            <Text style={styles.ruleCircle}>{rule.check ? '✔' : '◯'}</Text>
            <Text style={styles.ruleText}>{rule.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>회원가입</Text>}
      </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  matchText: {
    fontSize: 14,
    marginTop: 5,
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginTop: 5,
  },
  rulesContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleCircle: {
    marginRight: 10,
    fontSize: 16,
    color: 'green',
  },
  ruleText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpScreen;
