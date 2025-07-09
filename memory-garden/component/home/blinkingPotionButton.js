import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';

export default function BlinkingPotionButton({ 
  visible, 
  potionCount, 
  onPress, 
  style 
}) {
  const [blinkAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible && potionCount > 0) {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 600,
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

      return () => blinkAnimation.stop();
    } else {
      blinkAnim.setValue(1);
    }
  }, [visible, potionCount]);

  if (!visible || potionCount <= 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.potionButtonContainer,
        style,
        {
          opacity: blinkAnim,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.potionButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.potionIcon}>🧪</Text>
        <View style={styles.potionBadge}>
          <Text style={styles.potionCount}>{potionCount}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  potionButtonContainer: {
    position: 'absolute',
    zIndex: 100,
    //backgroundColor: '#87CEEB',
  },
  potionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9B59B6',
    //backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#E8D5FF',
  },
  potionIcon: {
    fontSize: 28,
  },
  potionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  potionCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
