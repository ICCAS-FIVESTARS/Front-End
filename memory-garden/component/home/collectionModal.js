import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function CollectionModal({ visible, onClose, hiddenItemList }) {
  const renderHiddenItem = (hasItem, index) => {
    return (
      <View
        key={index}
        style={[
          styles.itemBox,
          hasItem ? styles.hasItem : styles.noItem
        ]}
      >
        {hasItem ? (
          <Text style={styles.itemText}>🎁</Text>
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
          <Text style={styles.title}>히든 아이템 도감</Text>

          <View style={styles.collectionGrid}>
            {renderRow(0)}
            {renderRow(3)}
            {renderRow(6)}
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              수집 진행률: {hiddenItemList.filter(item => item === 1).length}/9
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
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
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
  },
  hasItem: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  noItem: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D0D0D0',
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
