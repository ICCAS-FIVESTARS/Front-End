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
  TextInput,
  Platform
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ViewShot from "react-native-view-shot";

import { getHtpStep, getTotalHtpSteps } from '../../utils/htpSequence';

const { width, height } = Dimensions.get('window');

export default function HtpTestPage({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);

  // 모든 단계의 그림을 저장하는 배열 (이전 그림 유지)
  const [allPaths, setAllPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');

  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [description, setDescription] = useState('');
  const [isEraserMode, setIsEraserMode] = useState(false);
  const scrollViewRef = useRef();
  const viewShotRef = useRef();

  const stepInfo = getHtpStep(currentStep);
  const totalSteps = getTotalHtpSteps();

  // PanResponder로 그림 그리기 처리 (이전 그림 유지)
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
        // 현재 그린 경로를 전체 경로 배열에 추가 (이전 그림과 함께 유지)
        setAllPaths(prev => [...prev, {
          path: currentPath,
          color: isEraserMode ? '#FFFFFF' : currentColor,
          strokeWidth: brushSize,
          step: currentStep // 어느 단계에서 그린 것인지 기록
        }]);
        setCurrentPath('');
      }
    }
  });

  // 현재 단계만 지우기 (이전 단계 그림은 유지)
  const clearCurrentStep = () => {
    setAllPaths(prev => prev.filter(pathObj => pathObj.step !== currentStep));
    setCurrentPath('');
  };

  // 전체 캔버스 지우기
  const clearAllCanvas = () => {
    setAllPaths([]);
    setCurrentPath('');
  };

  // 색상 변경
  const changeColor = (color) => {
    setCurrentColor(color);
    setIsEraserMode(false);
  };

  // 지우개 모드 토글
  const toggleEraserMode = () => {
    if (isEraserMode) {
      setCurrentColor('#000000');
      setIsEraserMode(false);
    } else {
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
      Alert.alert('Permission required', 'You need access to the photo library.');
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

  // 제출 가능 여부 확인 - 마지막 단계에서만 설명 필요
  const canSubmit = () => {
    const hasDrawingOrImage = allPaths.length > 0 || uploadedImage;

    // 마지막 단계가 아니면 그림만 있으면 됨
    if (currentStep < totalSteps) {
      return hasDrawingOrImage;
    }

    // 마지막 단계에서는 그림과 설명 모두 필요
    const hasDescription = description.trim().length > 0;
    return hasDrawingOrImage && hasDescription;
  };

  // 다음 단계 또는 완료 처리
  const handleNext = () => {
    if (!canSubmit()) {
      if (currentStep < totalSteps) {
        Alert.alert('Alert', 'Please draw a picture or upload a picture.');
      } else {
        Alert.alert('Alert', 'Please draw or upload the picture, and write a description.');
      }
      return;
    }

    // console.log(`HTP ${currentStep}단계 완료:`, {
    //   step: currentStep,
    //   object: stepInfo.object,
    //   allPaths: allPaths.filter(p => p.step === currentStep),
    //   uploadedImage,
    //   description: currentStep === totalSteps ? description : '' // 마지막 단계에서만 설명 저장
    // });

    setCurrentStep(currentStep + 1);
    setCurrentColor('#000000');
    setBrushSize(3);
    setIsEraserMode(false);

    // if (currentStep < totalSteps) {
    //   // 다음 단계로 (그림은 유지, 설명은 초기화하지 않음 - 어차피 마지막에만 입력)
    //   setCurrentStep(currentStep + 1);
    //   setCurrentColor('#000000');
    //   setBrushSize(3);
    //   setIsEraserMode(false);
    // } 
    // else {
    //   // HTP 검사 완료
    //   console.log('HTP 전체 완료:', {
    //     allPaths,
    //     uploadedImage,
    //     finalDescription: description
    //   });

    //   Alert.alert(
    //     'HTP 검사 완료',
    //     '집, 나무, 사람이 모두 포함된 HTP 심리검사가 완료되었습니다!',
    //     [
    //       {
    //         text: '확인',
    //         onPress: () => navigation.navigate('Home')
    //       }
    //     ]
    //   );
    // }
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      Alert.alert('Alert', 'Please draw or upload the picture, and write a description.');
      return;
    }

    try {
      let imageUri = null;
      let imageName = null;

      if (allPaths.length > 0) {
        // 직접 그린 그림(SVG 캡처)
        imageUri = await viewShotRef.current.capture();
        imageName = 'drawing.jpg'; // 저장할 파일명 지정
      } else if (uploadedImage) {
        // 앨범에서 업로드한 사진
        imageUri = uploadedImage;
        imageName = 'photo.jpg'; // 업로드용 임의 파일명
      }

      if (!imageUri) {
        Alert.alert('Error', 'No image has been selected.');
        return;
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: imageName,
        type: 'image/jpg', // 별도 포맷일 경우 변경
      });
      formData.append('description', description);

      const response = await fetch('http://34.63.32.189:8000/analyze/htp', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result) {
        console.log(result);
        Alert.alert(
          'HTP Test Completed',
          'The HTP Test that includes all houses, trees, and people is complete!',
          [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('faile', result.msg || 'Server Error');
      }
    } catch (e) {
      Alert.alert('Error', 'Image upload failed.');
      console.error(e);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      ref={scrollViewRef}
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
        <Text style={styles.stageNumber}>
          HTP Test {currentStep}/{totalSteps}
        </Text>
        <Text style={styles.questionText}>{stepInfo.instruction}</Text>
        <Text style={styles.descriptionText}>{stepInfo.description}</Text>

        {/* 진행 상황 표시 */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Completed Elements: {currentStep > 1 ? 'house' : ''}
            {currentStep > 2 ? ', tree' : ''}
            {currentStep > 3 ? ', people' : ''}
          </Text>
        </View>
      </View>

      {/* 그림 도구 */}
      <View style={styles.toolsContainer}>
        <Text style={styles.toolLabel}>Color:</Text>
        <View style={styles.colorPalette}>
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

          <TouchableOpacity
            style={[styles.eraserButton, isEraserMode && styles.selectedEraser]}
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
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isEraserMode && (
          <View style={styles.modeIndicator}>
            <Text style={styles.modeText}>🧽 Eraser Mode (Size: {brushSize})</Text>
          </View>
        )}
      </View>

      {/* SVG Canvas 영역 - 모든 이전 그림과 현재 그림 표시 */}
      <View style={styles.canvasContainer}>
        <View style={styles.svgContainer} {...panResponder.panHandlers}>
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1 }}>
            <Svg height="300" width="100%" style={styles.svg}>
              {/* 모든 이전 단계의 그림들 렌더링 */}
              {allPaths.map((pathObj, index) => (
                <Path
                  key={index}
                  d={pathObj.path}
                  stroke={pathObj.color}
                  strokeWidth={pathObj.strokeWidth}
                  fill="transparent"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {/* 현재 그리고 있는 경로 */}
              {currentPath !== '' && (
                <Path
                  d={currentPath}
                  stroke={isEraserMode ? '#FFFFFF' : currentColor}
                  strokeWidth={brushSize}
                  fill="transparent"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          </ViewShot>
        </View>

        <View style={styles.canvasTools}>
          <TouchableOpacity style={styles.clearCurrentButton} onPress={clearCurrentStep}>
            <Text style={styles.clearButtonText}>Clear the current step</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearAllButton} onPress={clearAllCanvas}>
            <Text style={styles.clearButtonText}>Clear Full</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 설명 입력 칸 - 마지막 단계에서만 표시 */}
      {currentStep === totalSteps && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>
            Please write down the description of the completed picture
          </Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Feel free to explain the picture you drew..."
            maxLength={500}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 500);
            }}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>
      )}

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

        {
          currentStep < totalSteps ? (
            <TouchableOpacity
              style={[
                styles.submitButton,
                !canSubmit() && styles.disabledButton
              ]}
              onPress={handleNext}
              disabled={!canSubmit()}
            >
              <Text style={[
                styles.submitButtonText,
                !canSubmit() && styles.disabledButtonText
              ]}>
                Next
              </Text>
            </TouchableOpacity>) : (
            <TouchableOpacity
              style={[
                styles.submitButton,
                !canSubmit() && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit()}>
              <Text style={[
                styles.submitButtonText,
                !canSubmit() && styles.disabledButtonText
              ]}>
                Submit
              </Text>
            </TouchableOpacity>
          )
        }


        {/* <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canSubmit()}
        >
          <Text style={[
            styles.submitButtonText,
            !canSubmit() && styles.disabledButtonText
          ]}>
            {currentStep < totalSteps ? '다음' : '완료'}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* 키보드 여백 확보를 위한 추가 공간 */}
      <View style={styles.keyboardSpacer} />
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
  progressContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
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
    justifyContent: 'space-between',
    padding: 10,
  },
  clearCurrentButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllButton: {
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
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
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
  keyboardSpacer: {
    height: 100,
  },
});
