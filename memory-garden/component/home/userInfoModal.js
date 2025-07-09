import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function UserInfoModal({ visible, onClose, userInfo, hiddenItemCount }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>유저 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>이름:</Text>
            <Text style={styles.value}>{userInfo.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>현재 스테이지:</Text>
            <Text style={styles.value}>{userInfo.stage+1}단계</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>완주 횟수:</Text>
            <Text style={styles.value}>{userInfo.clearTime}회</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>포션 개수:</Text>
            <Text style={styles.value}>{userInfo.potion}개</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>히든 아이템:</Text>
            <Text style={styles.value}>{hiddenItemCount}/9개</Text>
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
    minWidth: 300,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
