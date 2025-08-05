import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

export default function ResultModal({ visible, onClose, emotion }) {
    const sortedEmotion = [...emotion].sort((a, b) => b.value - a.value);
    const totalScore = emotion.reduce((acc, cur) => acc + cur.value, 0);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Emotion</Text>

                    <PieChart
                        data={emotion}
                        sectionAutoFocus
                        radius={68}
                        innerRadius={48}
                    />

                    <View style={styles.legendContainer}>
                        {sortedEmotion.map((item, idx) => (
                            <View key={idx} style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                                <Text style={styles.legendLabel}>{item.label}</Text>
                                <Text style={styles.legendValue}>{item.value}
                                    {' '}
                                    {/* 퍼센트 표시는 아래 2번 참고 */}
                                    ({((item.value / totalScore) * 100).toFixed(1)}%)</Text>
                            </View>
                        ))}
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
        width: width - 60,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 22,
        textAlign: 'center',
    },
    mainLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    mainValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    legendContainer: {
        width: '100%',
        marginTop: 28,
        marginBottom: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
        marginLeft: 10,
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 12,
    },
    legendLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#555',
    },
    legendValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    closeButton: {
        marginTop: 18,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
