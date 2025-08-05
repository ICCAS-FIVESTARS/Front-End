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
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';


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
  const [isEraserMode, setIsEraserMode] = useState(false);
  const scrollViewRef = useRef();
  const viewShotRef = useRef();

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

  //확인 버튼 - 그림 제출
  const handleSubmit = () => {
    if (!canSubmit()) {
      Alert.alert('Alert', 'Please draw or upload a picture, and write a description.');
      return;
    }

    // 그림 제출 처리
    //console.log('그림 제출:', { stage, paths, uploadedImage, description });

    // userInfo의 stage 값을 +1 증가
    const newStage = userInfo.stage + 1;

    // emotion 배열에서 랜덤 label을 1개 고르기
    const labels = userInfo.emotion.map(e => e.label);
    const selectedLabel = labels[Math.floor(Math.random() * labels.length)];

    // label 값이 selectedLabel과 같은 것만 value+1
    const updated = userInfo.emotion.map(e =>
      e.label === selectedLabel ? { ...e, value: e.value + 1 } : e
    );
    updateUserInfo({ stage: newStage, emotion: updated });

    // 격려 모달 표시
    setModalVisible(true);
  };

  // 핸드폰에 캡쳐해서 그림 저장 테스트
  // const handleSubmit = async () => {
  //   if (!canSubmit()) {
  //     Alert.alert('알림', '그림을 그리거나 사진을 업로드하고, 설명을 작성해주세요.');
  //     return;
  //   }

  //   try {
  //     // 1. SVG 영역 캡처
  //     const uri = await viewShotRef.current.capture();

  //     // 2. 저장 권한 요청
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       Alert.alert('권한 필요', '저장소 접근 권한이 필요합니다.');
  //       return;
  //     }

  //     // 3. 갤러리(다운로드)에 저장
  //     await MediaLibrary.saveToLibraryAsync(uri);

  //     Alert.alert('완료', '이미지가 갤러리에 저장되었습니다!');

  //     // userInfo의 stage 값을 +1 증가
  //     const newStage = userInfo.stage + 1;
  //     updateUserInfo({ stage: newStage });

  //     // 격려 모달 표시
  //     setModalVisible(true);

  //   } catch (e) {
  //     Alert.alert('오류', '이미지 저장에 실패했습니다.');
  //     console.error(e);
  //   }
  // };

  //   const handleSubmit = async () => {
  //   if (!canSubmit()) {
  //     Alert.alert('알림', '그림을 그리거나 사진을 업로드하고, 설명을 작성해주세요.');
  //     return;
  //   }

  //   try {
  //     let imageUri = null;
  //     let imageName = null;

  //     if (paths.length > 0) {
  //       // 직접 그린 그림(SVG 캡처)
  //       imageUri = await viewShotRef.current.capture();
  //       imageName = 'drawing.png'; // 저장할 파일명 지정
  //     } else if (uploadedImage) {
  //       // 앨범에서 업로드한 사진
  //       imageUri = uploadedImage;
  //       imageName = 'photo.jpg'; // 업로드용 임의 파일명
  //     }

  //     if (!imageUri) {
  //       Alert.alert('오류', '이미지가 선택되지 않았습니다.');
  //       return;
  //     }

  //     // FormData 생성
  //     const formData = new FormData();
  //     formData.append('image', {
  //       uri: imageUri,
  //       name: imageName,
  //       type: 'image/png', // 별도 포맷일 경우 변경
  //     });
  //     formData.append('description', description);

  //     const response = await fetch('http://192.168.50.85:4000/upload', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const result = await response.json();
  //     if (result.success) {
  //       Alert.alert('성공', '제출이 완료되었습니다!');

  //       // userInfo의 stage 값을 +1 증가
  //       const newStage = userInfo.stage + 1;
  //       updateUserInfo({ stage: newStage });
  //       setModalVisible(true); // 기존 동작 유지
  //     } else {
  //       Alert.alert('실패', result.msg || '서버 오류');
  //     }
  //   } catch (e) {
  //     Alert.alert('오류', '이미지 업로드에 실패했습니다.');
  //     console.error(e);
  //   }
  // };


  // 모달 닫기 및 홈으로 이동
  const handleModalClose = () => {
    setModalVisible(false);
    updateUserInfo({
      ...userInfo,
      drawingSubmitted: true,
    });
    navigation.goBack();
    //navigation.navigate('Home', { drawingSubmitted: true });
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
        <Text style={styles.stageNumber}>Stage {stage}</Text>
        <Text style={styles.questionText}>{stageInfo.question}</Text>
        <Text style={styles.descriptionText}>{stageInfo.description}</Text>
      </View>

      {/* 그림 도구 */}
      <View style={styles.toolsContainer}>
        <Text style={styles.toolLabel}>Color:</Text>
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

        <Text style={styles.toolLabel}>Brush Size:</Text>
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
            <Text style={styles.modeText}>🧽 Eraser Mode (Size: {brushSize})</Text>
          </View>
        )}
      </View>

      {/* SVG Canvas 영역 */}
      <View style={styles.canvasContainer}>
        <View
          style={styles.svgContainer}
          {...panResponder.panHandlers}
        >
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
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
          </ViewShot>
        </View>

        <View style={styles.canvasTools}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 설명 입력 칸 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Please write down the description of the picture</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Feel free to explain the picture you drew..."
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
          <Text style={styles.imagePreviewText}>Uploaded Image</Text>
          <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setUploadedImage(null)}
          >
            <Text style={styles.removeImageText}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 하단 버튼들 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>📷 Uploaded Image</Text>
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
          ]}>Submit</Text>
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
