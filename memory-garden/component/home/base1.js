import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  ImageBackground,
  Image
} from 'react-native';
import { useUser } from '../../utils/user';
import CollectionModal from './collectionModal';
import UserInfoModal from './userInfoModal';
import BlinkingPotionButton from './blinkingPotionButton';
import EasterEggBubble from './easterEggBubble';
import { getRandomEasterEggMessage } from '../../utils/easterEggMessages';

// 이미지 파일들 불러오기
const backgroundImg = require('../../assets/home/backgroundImg.png');
const grayLight = require('../../assets/home/grayLight.png');
const yelloLight = require('../../assets/home/yelloLight.png');

const characterGifs = [
  require('../../assets/character/stage1.gif'),
  require('../../assets/character/stage2.gif'),
  require('../../assets/character/stage3.gif'),
  require('../../assets/character/stage4.gif'),
  require('../../assets/character/stage5.gif'),
  require('../../assets/character/stage6.gif'),
  require('../../assets/character/stage7.gif'),
  require('../../assets/character/stage8.gif'),
  require('../../assets/character/stage9.gif'),
  require('../../assets/character/stage10.gif'),
  require('../../assets/character/stage11.gif'),
  require('../../assets/character/stage12.gif'),
];

const potionGifs = [
  require('../../assets/potion/stage1_potion.gif'),
  require('../../assets/potion/stage2_potion.gif'),
  require('../../assets/potion/stage3_potion.gif'),
  require('../../assets/potion/stage4_potion.gif'),
  require('../../assets/potion/stage5_potion.gif'),
  require('../../assets/potion/stage6_potion.gif'),
  require('../../assets/potion/stage7_potion.gif'),
  require('../../assets/potion/stage8_potion.gif'),
  require('../../assets/potion/stage9_potion.gif'),
  require('../../assets/potion/stage10_potion.gif'),
  require('../../assets/potion/stage11_potion.gif'),
  require('../../assets/potion/stage12_potion.gif'),
];

const { width, height } = Dimensions.get('window');

export default function HomePage({ navigation }) {
  const [blinkAnim] = useState(new Animated.Value(1));
  const { userInfo, updateUserInfo, getHiddenItemCount, usePotion, unlockRandomHiddenItem, completeSet } = useUser();
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');
  const [showPotionGif, setShowPotionGif] = useState(false);

  // 12개 전구의 고정 위치 (아치형 배경에 맞게 수동 조정)
  const lightPositions = [
    { x: width * 0.10, y: height * 0.45 },  // 1번 전구
    { x: width * 0.10, y: height * 0.37 },  // 2번 전구
    { x: width * 0.10, y: height * 0.30 },  // 3번 전구
    { x: width * 0.12, y: height * 0.22 },  // 4번 전구
    { x: width * 0.24, y: height * 0.15 },  // 5번 전구
    { x: width * 0.37, y: height * 0.10 },  // 6번 전구
    { x: width * 0.63, y: height * 0.10 },  // 7번 전구 
    { x: width * 0.76, y: height * 0.15 },  // 8번 전구 
    { x: width * 0.88, y: height * 0.22 },  // 9번 전구 
    { x: width * 0.90, y: height * 0.30 },  // 10번 전구 
    { x: width * 0.90, y: height * 0.37 },  // 11번 전구 
    { x: width * 0.90, y: height * 0.45 },  // 12번 전구 
  ];

  // 현재 스테이지 전구 깜빡임 애니메이션 - 수정된 부분
  useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,  // 더 어둡게
          duration: 600, // 조금 더 빠르게
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
      blinkAnimation.reset();
    };
  }, [blinkAnim, userInfo.stage]); // userInfo.stage 의존성 추가

  // 12스테이지 완료 체크
  useEffect(() => {
    if (userInfo.stage >= 12) {
      checkSetCompletion();
    }
  }, [userInfo.stage]);



  // 캐릭터 위치 (아치형 길 위)
  const getCharacterPosition = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    return {
      x: centerX - 40,
      y: centerY + 0
    };
  };

  // 스테이지 상태 결정
  const getStageStatus = (stageIndex) => {
    if (stageIndex < userInfo.stage) return 'completed';
    if (stageIndex === userInfo.stage) return 'current';
    return 'locked';
  };

  // 전구 이미지 선택
  const getLightImage = (stageIndex) => {
    const status = getStageStatus(stageIndex);
    switch (status) {
      case 'completed':
        return yelloLight;
      case 'current':
        return grayLight;
      case 'locked':
        return grayLight;
      default:
        return grayLight;
    }
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

  // 세트 완료 체크
  const checkSetCompletion = () => {
    if (userInfo.stage >= 12) {
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
      completeSet();
      Alert.alert(
        '축하합니다!',
        '1세트를 완료하셨습니다! 새로운 여정이 시작됩니다.',
        [{ text: '확인' }]
      );
    }
  };

  // 포션 사용
  const handlePotionUse = () => {
    const result = usePotion();
    if (result.success) {
      setShowPotionGif(true);
      const message = getRandomEasterEggMessage();
      setEasterEggMessage(message);
      setEasterEggVisible(true);

      setTimeout(() => {
        setShowPotionGif(false);
      }, 2000);
      
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

  const characterPos = getCharacterPosition();

  return (
    <ImageBackground
      source={backgroundImg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
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
          {/* 고정 위치 전구 스테이지 버튼들 */}
          {lightPositions.map((position, index) => {
            const status = getStageStatus(index);
            const lightImage = getLightImage(index);
            const isCurrentStage = status === 'current';

            return (
              <View
                key={index}
                style={[
                  styles.lightButton,
                  {
                    position: 'absolute',
                    left: position.x - 30,
                    top: position.y - 30,
                  }
                ]}
              >
                <TouchableOpacity onPress={() => handleStagePress(index)}>
                  <Animated.View
                    style={[
                      styles.lightContainer,
                      // 현재 스테이지일 때만 깜빡임 애니메이션 적용
                      isCurrentStage && {
                        opacity: blinkAnim
                      }
                    ]}
                  >
                    <Image
                      source={lightImage}
                      style={[
                        styles.lightImage,
                        // 현재 스테이지 추가 스타일
                        isCurrentStage && styles.currentStageLight
                      ]}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.stageNumber,
                        // 현재 스테이지 숫자 스타일
                        isCurrentStage && styles.currentStageNumber
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* 캐릭터 영역 */}
          <View
            style={[
              styles.characterContainer,
              {
                position: 'absolute',
                left: characterPos.x,
                top: characterPos.y,
              }
            ]}
          >
            <View style={styles.characterBox}>
              {/* <Text style={styles.characterText}>캐릭터</Text> */}
              <Image
                source={
                  showPotionGif
                  ? potionGifs[userInfo.stage]
                  : characterGifs[userInfo.stage]}
                }
                style={[styles.characterImage]}
                resizeMode="contain"
              />
            </View>

            {/* 포션 버튼 - 캐릭터 근처에 배치 */}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  lightButton: {
    width: 60,
    height: 60,
  },
  lightContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lightImage: {
    width: 60,
    height: 60,
  },
  // 현재 스테이지 전구 추가 스타일
  currentStageLight: {
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  stageNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -7 },
      { translateY: -7 }
    ],
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 현재 스테이지 숫자 추가 스타일
  currentStageNumber: {
    color: '#000',
    fontWeight: '900',
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterBox: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 182, 193, 0.9)',
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
    top: 120,
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
