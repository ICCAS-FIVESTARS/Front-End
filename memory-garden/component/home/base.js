import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import { useUser } from '../../utils/user';
import CollectionModal from './collectionModal';
import UserInfoModal from './userInfoModal';
import BlinkingPotionButton from './blinkingPotionButton';
import EasterEggBubble from './easterEggBubble';
import { getRandomEasterEggMessage } from '../../utils/easterEggMessages';

const { width, height } = Dimensions.get('window');

export default function HomePage({ navigation }) {
  const [blinkAnim] = useState(new Animated.Value(1));
  const { userInfo, updateUserInfo, getHiddenItemCount, usePotion, unlockRandomHiddenItem, completeSet } = useUser();
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');

  // 다음 스테이지 깜빡임 애니메이션
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, []);

  // 12스테이지 완료 체크
  useEffect(() => {
    if (userInfo.stage >= 12) {
      checkSetCompletion();
    }
  }, [userInfo.stage]);

  // 스테이지 버튼 배치를 위한 좌표 계산
  const getStagePosition = (index) => {
    const centerX = width / 2;
    const centerY = height / 2 - 30;
    const radius = 140;
    const buttonSize = 50;

    if (index >= 0 && index <= 2) {
      const x = centerX - radius - buttonSize / 2;
      const yStart = centerY + 60;
      const yEnd = centerY - 60;
      const y = yStart + (yEnd - yStart) / 2 * index;
      return { x, y };
    } else if (index >= 3 && index <= 8) {
      const startAngle = Math.PI;
      const endAngle = 0;
      const posInArc = index - 3;
      const angle = startAngle - (startAngle - endAngle) * (posInArc / 5);
      const x = centerX + radius * Math.cos(angle) - buttonSize / 2;
      const y = centerY - Math.abs(radius * Math.sin(angle)) - buttonSize / 2 - 100;
      return { x, y };
    } else if (index >= 9 && index <= 11) {
      const x = centerX + radius + buttonSize / 2 - 50;
      const yStart = centerY - 60;
      const yEnd = centerY + 60;
      const y = yStart + (yEnd - yStart) / 2 * (index - 9);
      return { x, y };
    } else {
      return { x: centerX, y: centerY };
    }
  };

  // 스테이지 버튼 상태 결정
  const getStageStatus = (stageIndex) => {
    if (stageIndex < userInfo.stage) return 'completed';
    if (stageIndex === userInfo.stage) return 'current';
    return 'locked';
  };

  const handleStagePress = (stageIndex) => {
    const status = getStageStatus(stageIndex);
    if (status === 'current') {
      navigation.navigate('Drawing', { stage: stageIndex + 1 });
    } else if (status === 'completed') {
      Alert.alert('알림', `클리어한 스테이지 입니다.`);
    } else {
      Alert.alert('알림', '아직 잠긴 스테이지입니다.');
    }
  };

  // 스테이지 완료 시 세트 완료 체크
  const checkSetCompletion = () => {
    if (userInfo.stage >= 12) {
      // 포션을 4개 사용했는지 체크
      if (userInfo.currentSetPotionUsed >= 4) {
        const unlocked = unlockRandomHiddenItem();
        if (unlocked) {
          Alert.alert(
            '🎉 이스터에그 발견!',
            '포션의 마법으로 숨겨진 아이템을 발견했습니다!',
            [{ text: '확인' }]
          );
        }
      }

      // 세트 완료 처리
      completeSet();
      Alert.alert(
        '축하합니다!',
        '1세트를 완료하셨습니다! 새로운 여정이 시작됩니다.',
        [{ text: '확인' }]
      );
    }
  };

  // 포션 사용 함수
  const handlePotionUse = () => {
    const result = usePotion();
    if (result.success) {
      // 이스터에그 메시지 표시
      const message = getRandomEasterEggMessage();
      setEasterEggMessage(message);
      setEasterEggVisible(true);

      Alert.alert(
        '포션 사용',
        `포션을 마셨습니다! (남은 포션: ${result.remainingPotion}개)\n현재 세트에서 사용한 포션: ${result.potionUsedInSet}/4개`
      );
    } else {
      Alert.alert('알림', '포션이 부족합니다!');
    }
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* 상단 UI */}
      <View style={styles.topBar}>
        <View style={styles.lifeContainer}>
          <Text style={styles.lifeText}>❤️</Text>
          <Text style={styles.lifeCount}>3</Text>
        </View>

        <View style={styles.topButtonGroup}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setUserModalVisible(true)}
          >
            <Text style={styles.buttonText}>👤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setCollectionModalVisible(true)}
          >
            <Text style={styles.buttonText}>📚</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 유저 정보 모달 */}
      <UserInfoModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        userInfo={userInfo}
        hiddenItemCount={getHiddenItemCount()}
      />

      {/* 도감 모달 */}
      <CollectionModal
        visible={collectionModalVisible}
        onClose={() => setCollectionModalVisible(false)}
        hiddenItemList={userInfo.hidden_item_list}
      />

      {/* 정원 영역 */}
      <View style={styles.gardenContainer}>
        {/* 아치형 스테이지 버튼들 */}
        {Array.from({ length: 12 }, (_, index) => {
          const position = getStagePosition(index);
          const status = getStageStatus(index);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.stageButton,
                {
                  position: 'absolute',
                  left: position.x,
                  top: position.y,
                }
              ]}
              onPress={() => handleStagePress(index)}
            >
              <Animated.View
                style={[
                  styles.stageButtonInner,
                  status === 'completed' && styles.completedStage,
                  status === 'current' && [
                    styles.currentStage,
                    { opacity: blinkAnim }
                  ],
                  status === 'locked' && styles.lockedStage,
                ]}
              >
                <Text
                  style={[
                    styles.stageNumber,
                    status === 'completed' && styles.completedText,
                    status === 'current' && styles.currentText,
                    status === 'locked' && styles.lockedText,
                  ]}
                >
                  {index + 1}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}

        {/* 중앙 캐릭터 영역 */}
        <View style={styles.characterContainer}>
          <View style={styles.characterBox}>
            <Text style={styles.characterText}>캐릭터</Text>
          </View>

          {/* 포션 버튼 - 캐릭터 밑에 배치 */}
          <BlinkingPotionButton
            visible={userInfo.potion > 0}
            potionCount={userInfo.potion}
            onPress={handlePotionUse}
            style={styles.potionButtonPosition}
          />

          {/* 이스터에그 말풍선 */}
          <EasterEggBubble
            visible={easterEggVisible}
            message={easterEggMessage}
            onComplete={() => setEasterEggVisible(false)}
          />
        </View>
      </View>

      {/* 임시 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  topButtonGroup: {
    flexDirection: 'row',
    gap: 15,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lifeContainer: {
    alignItems: 'center',
  },
  lifeText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  lifeCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonText: {
    fontSize: 20,
  },
  gardenContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageButton: {
    width: 50,
    height: 50,
  },
  stageButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  completedStage: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  currentStage: {
    backgroundColor: '#00FF7F',
    borderColor: '#32CD32',
  },
  lockedStage: {
    backgroundColor: '#D3D3D3',
    borderColor: '#A9A9A9',
  },
  stageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#8B4513',
  },
  currentText: {
    color: '#006400',
  },
  lockedText: {
    color: '#696969',
  },
  characterContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF69B4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B008B',
  },
  potionButtonPosition: {
    top: 100, // 캐릭터 밑에 배치
    left: 0,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
