import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SignupBase({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  // ID 중복 확인 함수
  const checkIdDuplicate = () => {
    if (!id.trim()) {
      Alert.alert('Alert', 'Please enter your ID.');
      return;
    }

    // 실제로는 서버에 요청을 보내야 하지만, 여기서는 간단한 로직으로 처리
    const usedIds = ['admin', 'test', 'user', '1234'];

    if (usedIds.includes(id.toLowerCase())) {
      setIsIdAvailable(false);
      setIsIdChecked(true);
      Alert.alert('Check redundancy', 'This ID is already in use.');
    } else {
      setIsIdAvailable(true);
      setIsIdChecked(true);
      Alert.alert('Check redundancy', 'This is a valid ID.');
    }
  };

  // ID 입력값이 변경될 때 중복확인 상태 초기화
  const handleIdChange = (text) => {
    setId(text);
    setIsIdChecked(false);
    setIsIdAvailable(false);
  };

  // 회원가입 처리 함수
  const handleSignup = () => {
    if (!id.trim()) {
      Alert.alert('Alert', 'Please enter your ID.');
      return;
    }

    if (!isIdChecked) {
      Alert.alert('Alert', 'Please double-check your ID.');
      return;
    }

    if (!isIdAvailable) {
      Alert.alert('Alert', 'Please change it to an available ID.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Alert', 'Please enter your password.');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Alert', 'Please enter a password of at least 4 digits.');
      return;
    }

    // 회원가입 성공
    Alert.alert(
      'Membership registration completed',
      'Your membership has been registered!',
      [
        {
          text: 'Ok',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={50}
      extraHeight={100}
    >
      <Text style={styles.title}>Join</Text>

      {/* ID 입력 영역 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ID</Text>
        <View style={styles.idInputRow}>
          <TextInput
            style={[styles.input, styles.idInput]}
            placeholder="Please enter your ID"
            value={id}
            onChangeText={handleIdChange}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.checkButton}
            onPress={checkIdDuplicate}
          >
            <Text style={styles.checkButtonText}>Check redundancy</Text>
          </TouchableOpacity>
        </View>

        {isIdChecked && (
          <Text style={[
            styles.checkResult,
            isIdAvailable ? styles.available : styles.unavailable
          ]}>
            {isIdAvailable ? '✓ This is an available ID' : '✗ ID already in use'}
          </Text>
        )}
      </View>

      {/* 비밀번호 입력 영역 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Please enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Join</Text>
      </TouchableOpacity>

      {/* 로그인 페이지로 이동 */}
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginLinkText}>
          Do you already have an account? Login
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  idInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idInput: {
    flex: 1,
    marginRight: 10,
  },
  checkButton: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  checkResult: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  available: {
    color: '#28a745',
  },
  unavailable: {
    color: '#dc3545',
  },
  signupButton: {
    height: 50,
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
