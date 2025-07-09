import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useUser } from '../../utils/user';

const { width, height } = Dimensions.get('window');

export default function TutorialPage({ navigation }) {
  const { completeFirstLogin } = useUser();

  const handleTestSelection = (testNumber) => {
    // 첫 로그인 완료 처리
    completeFirstLogin();
    
    if (testNumber === 1) {
      navigation.navigate('HtpTest');
    } else if (testNumber === 2) {
      navigation.navigate('RainPersonTest');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>심리 검사 선택</Text>
        <Text style={styles.subtitle}>1, 2번 버튼 중 하나를 선택하세요!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => handleTestSelection(1)}
        >
          <Text style={styles.buttonText}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => handleTestSelection(2)}
        >
          <Text style={styles.buttonText}>2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  testButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
});
