import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RollcallBubble({ visible, message, onComplete }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    if (visible) {
      // 말풍선 나타나는 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();

      // 3초 후 사라지는 애니메이션
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          })
        ]).start(() => {
          onComplete && onComplete();
        });
      }, 3000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{message}</Text>
        <View style={styles.bubbleTail} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    top: -80,
    left: -width * 0.15,
    zIndex: 1000,
    width: 500
  },
  bubble: {
    backgroundColor: '#FFE4E1',
    borderRadius: 20,
    padding: 15,
    maxWidth: width * 0.7,
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
  bubbleText: {
    fontSize: 14,
    color: '#8B008B',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF69B4',
  },
});
