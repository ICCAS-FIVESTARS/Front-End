import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';

export default function CollectionModal({ visible, onClose, hiddenItemList }) {
  const renderHiddenItem = (hasItem, index) => {
    // 인덱스에 따른 고정 GIF 매핑
    const getGifByIndex = (index) => {
      const gifMap = {
        0: require('../../assets/hidden/random1.gif'),
        1: require('../../assets/hidden/random2.gif'),
        2: require('../../assets/hidden/random3.gif'),
        3: require('../../assets/hidden/random4.gif'),
        4: require('../../assets/hidden/random5.gif'),
        5: require('../../assets/hidden/random6.gif'),
      };
      return gifMap[index] || require('../../assets/hidden/random1.gif');
    };

    // return (
    //   <View
    //     key={index}
    //     style={[
    //       styles.itemBox,
    //       hasItem ? styles.hasItem : styles.noItem
    //     ]}
    //   >
    //     {hasItem ? (
    //       <Text style={styles.itemText}>🎁</Text>
    //     ) : (
    //       <Text style={styles.emptyText}>?</Text>
    //     )}
    //   </View>
    // );
    return (
    <View
      key={index}
      style={[
        styles.itemBox,
        hasItem ? styles.hasItem : styles.noItem,
      ]}
    >
      {hasItem ? (
        <Image
          source={getGifByIndex(index)}
          style={styles.gifImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.emptyText}>?</Text>
      )}
    </View>
  );
  };

  const renderRow = (startIndex) => {
    return (
      <View key={startIndex} style={styles.row}>
        {[0, 1, 2].map(offset => {
          const index = startIndex + offset;
          const hasItem = hiddenItemList[index] === 1;
          return renderHiddenItem(hasItem, index);
        })}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Hidden item drawing book</Text>

          <View style={styles.collectionGrid}>
            {renderRow(0)}
            {renderRow(3)}
            {/* {renderRow(6)} */}
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Collection progress: {hiddenItemList.filter(item => item === 1).length}/6
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  collectionGrid: {
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    padding: 5,
  },
  hasItem: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  noItem: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D0D0D0',
  },
  gifImage: {
    width: 70,           
    height: 70,          
    borderRadius: 8,     
  },
  itemText: {
    fontSize: 24,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
