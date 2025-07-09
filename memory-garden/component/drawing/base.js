import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  PanResponder,
  TextInput
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStageQuestion } from '../../utils/stageQuestion';
import { getEncouragementMessage } from '../../utils/encouragementMessage';
import { useUser } from '../../utils/user';
import MentModal from './mentModal';

const { width, height } = Dimensions.get('window');

export default function DrawingPage({ route, navigation }) {
  const { stage } = route.params;
  const { userInfo, updateUserInfo } = useUser();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false); // 지우개 모드 상태
  const scrollViewRef = useRef();
  
  const stageInfo = getStageQuestion(stage);
  const encouragementMsg = getEncouragementMessage(stage);

  // PanResponder로 그림 그리기 처리
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `M${locationX.toFixed(2)},${locationY.toFixed(2)}`;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setCurrentPath(prev => prev + ` L${locationX.toFixed(2)},${locationY.toFixed(2)}`);
    },

    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths(prev => [...prev, {
          path: currentPath,
          color: isEraserMode ? '#FFFFFF' : currentColor,
          strokeWidth: brushSize
        }]);
        setCurrentPath('');
      }
    }
  });

  // 캔버스 지우기
  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  // 색상 변경
  const changeColor = (color) => {
    setCurrentColor(color);
    setIsEraserMode(false); // 색상 선택 시 지우개 모드 해제
  };

  // 지우개 모드 토글
  const toggleEraserMode = () => {
    if (isEraserMode) {
      // 지우개 모드 해제 - 검정색으로 복원
      setCurrentColor('#000000');
      setIsEraserMode(false);
    } else {
      // 지우개 모드 활성화 - 흰색으로 변경
      setCurrentColor('#FFFFFF');
      setIsEraserMode(true);
    }
  };

  // 브러시 크기 변경
  const changeBrushSize = (size) => {
    setBrushSize(size);
  };

  // 앨범에서 사진 업로드
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // 제출 가능 여부 확인
  const canSubmit = () => {
    const hasDrawingOrImage = paths.length > 0 || uploadedImage;
    const hasDescription = description.trim().length > 0;
    return hasDrawingOrImage && hasDescription;
  };

  // // 확인 버튼 - 그림 제출
  // const handleSubmit = () => {
  //   if (!canSubmit()) {
  //     Alert.alert('알림', '그림을 그리거나 사진을 업로드하고, 설명을 작성해주세요.');
  //     return;
  //   }

  //   // 그림 제출 처리
  //   console.log('그림 제출:', { stage, paths, uploadedImage, description });
    
  //   // userInfo의 stage 값을 +1 증가
  //   updateUserInfo({ stage: userInfo.stage + 1 });
    
  //   // 격려 모달 표시
  //   setModalVisible(true);
  // };

  // 확인 버튼 - 그림 제출
const handleSubmit = () => {
  if (!canSubmit()) {
    Alert.alert('알림', '그림을 그리거나 사진을 업로드하고, 설명을 작성해주세요.');
    return;
  }

  // 그림 제출 처리
  console.log('그림 제출:', { stage, paths, uploadedImage, description });
  
  // userInfo의 stage 값을 +1 증가
  const newStage = userInfo.stage + 1;
  updateUserInfo({ stage: newStage });

  // 격려 모달 표시
  setModalVisible(true);
};

  // 모달 닫기 및 홈으로 이동
  const handleModalClose = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
      extraHeight={150}
      showsVerticalScrollIndicator={true}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      {/* 상단 문구 */}
      <View style={styles.questionContainer}>
        <Text style={styles.stageNumber}>스테이지 {stage}</Text>
        <Text style={styles.questionText}>{stageInfo.question}</Text>
        <Text style={styles.descriptionText}>{stageInfo.description}</Text>
      </View>

      {/* 그림 도구 */}
      <View style={styles.toolsContainer}>
        <Text style={styles.toolLabel}>색상:</Text>
        <View style={styles.colorPalette}>
          {/* 색상 버튼들 */}
          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton, 
                { backgroundColor: color },
                currentColor === color && !isEraserMode && styles.selectedColor
              ]}
              onPress={() => changeColor(color)}
            />
          ))}

          {/* 지우개 버튼 */}
          <TouchableOpacity
            style={[
              styles.eraserButton,
              isEraserMode && styles.selectedEraser
            ]}
            onPress={toggleEraserMode}
          >
            <Text style={styles.eraserIcon}>🧽</Text>
            {isEraserMode && (
              <Text style={styles.eraserSize}>{brushSize}</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.toolLabel}>브러시 크기:</Text>
        <View style={styles.brushSizes}>
          {[1, 3, 5, 8, 12].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.brushButton,
                brushSize === size && styles.activeBrushButton
              ]}
              onPress={() => changeBrushSize(size)}
            >
              <Text style={[
                styles.brushButtonText,
                brushSize === size && styles.activeBrushText
              ]}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 현재 모드 표시 */}
        {isEraserMode && (
          <View style={styles.modeIndicator}>
            <Text style={styles.modeText}>🧽 지우개 모드 (크기: {brushSize})</Text>
          </View>
        )}
      </View>

      {/* SVG Canvas 영역 */}
      <View style={styles.canvasContainer}>
        <View 
          style={styles.svgContainer}
          {...panResponder.panHandlers}
        >
          <Svg height={300} width={width - 40} style={styles.svg}>
            {/* 기존에 그린 경로들 */}
            {paths.map((p, index) => (
              <Path
                key={index}
                d={p.path}
                stroke={p.color}
                strokeWidth={p.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {/* 현재 그리고 있는 경로 */}
            {currentPath !== '' && (
              <Path
                d={currentPath}
                stroke={isEraserMode ? '#FFFFFF' : currentColor}
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        </View>
        
        <View style={styles.canvasTools}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>지우기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 설명 입력 칸 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>그림에 대한 설명을 적어주세요</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="당신이 그린 그림에 대해 자유롭게 설명해주세요..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }}
        />
        <Text style={styles.characterCount}>{description.length}/500</Text>
      </View>

      {/* 업로드된 이미지 미리보기 */}
      {uploadedImage && (
        <View style={styles.imagePreview}>
          <Text style={styles.imagePreviewText}>업로드된 이미지</Text>
          <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
          <TouchableOpacity 
            style={styles.removeImageButton} 
            onPress={() => setUploadedImage(null)}
          >
            <Text style={styles.removeImageText}>이미지 제거</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 하단 버튼들 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>📷 사진 업로드</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            !canSubmit() && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!canSubmit()}
        >
          <Text style={[
            styles.submitButtonText,
            !canSubmit() && styles.disabledButtonText
          ]}>확인</Text>
        </TouchableOpacity>
      </View>

      

      {/* 격려 메시지 모달 */}
      <MentModal
        visible={modalVisible}
        onClose={handleModalClose}
        message={encouragementMsg.message}
        subMessage={encouragementMsg.subMessage}
      />
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
    padding: 20,
    paddingBottom: 40,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  toolsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  colorPalette: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  eraserButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedEraser: {
    borderColor: '#FF6B6B',
    borderWidth: 3,
    backgroundColor: '#FFE6E6',
  },
  eraserIcon: {
    fontSize: 16,
  },
  eraserSize: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF6B6B',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  brushSizes: {
    flexDirection: 'row',
  },
  brushButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeBrushButton: {
    backgroundColor: '#007AFF',
  },
  brushButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeBrushText: {
    color: 'white',
  },
  modeIndicator: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  canvasContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  svgContainer: {
    height: 300,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  svg: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  canvasTools: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#999',
  },
  imagePreview: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20
  },
  imagePreviewText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  previewImage: {
    width: width - 80,
    height: (width - 80) * 0.75,
    borderRadius: 10,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeImageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
