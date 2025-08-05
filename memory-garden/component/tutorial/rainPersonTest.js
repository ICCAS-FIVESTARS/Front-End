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

const { width, height } = Dimensions.get('window');

export default function RainPersonTestPage({ navigation }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [description, setDescription] = useState('');
  const [isEraserMode, setIsEraserMode] = useState(false);
  const scrollViewRef = useRef();

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

  // 제출 가능 여부 확인
  const canSubmit = () => {
    const hasDrawingOrImage = paths.length > 0 || uploadedImage;
    const hasDescription = description.trim().length > 0;
    return hasDrawingOrImage && hasDescription;
  };

  // 완료 처리
  const handleComplete = () => {
    if (!canSubmit()) {
      Alert.alert('Alert', 'Please draw or upload the picture, and write a description.');
      return;
    }

    //console.log('빗속 사람 검사 완료:', { paths, uploadedImage, description });

    Alert.alert(
      'DAPR Test Completed',
      'DAPR Test is complete!',
      [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
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
        <Text style={styles.stageNumber}>DAPR Test</Text>
        <Text style={styles.questionText}>Draw a person when it's raining</Text>
        <Text style={styles.descriptionText}>
          Feel free to express how a person behaves in a rainy situation
        </Text>
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

      {/* SVG Canvas 영역 */}
      <View style={styles.canvasContainer}>
        <View style={styles.svgContainer} {...panResponder.panHandlers}>
          <Svg height="300" width="100%" style={styles.svg}>
            {paths.map((p, index) => (
              <Path
                key={index}
                d={p.path}
                stroke={p.color}
                strokeWidth={p.strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
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
        </View>
        
        <View style={styles.canvasTools}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 설명 입력 칸 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Please write down the description of the completed picture</Text>
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
          onPress={handleComplete}
          disabled={!canSubmit()}
        >
          <Text style={[
            styles.submitButtonText,
            !canSubmit() && styles.disabledButtonText
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
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
