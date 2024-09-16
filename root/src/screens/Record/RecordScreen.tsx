import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

type MealType = '朝食' | '昼食' | '間食' | '夕食' | '夜食';

type MealRecord = {
  id: string;
  duration: number;
  startTime: Date;
  mealType: MealType;
  imageUri?: string;
};

const RecordScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MealRecord | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, timer]);

  const determineMealType = (time: Date): MealType => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 10) return '朝食';
    if (hour >= 10 && hour < 15) return '昼食';
    if (hour >= 15 && hour < 18) return '間食';
    if (hour >= 18 && hour < 22) return '夕食';
    return '夜食';
  };

  const toggleTimer = () => {
    if (isRecording) {
      const endTime = new Date();
      const newRecord: MealRecord = {
        id: Date.now().toString(),
        duration: timer,
        startTime: new Date(endTime.getTime() - timer * 1000),
        mealType: determineMealType(endTime),
      };
      setMealRecords((prevRecords) => [newRecord, ...prevRecords]);
      setTimer(0);
    }
    setIsRecording(!isRecording);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openMealTypeModal = (record: MealRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const changeMealType = (newType: MealType) => {
    if (selectedRecord) {
      setMealRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === selectedRecord.id ? { ...record, mealType: newType } : record
        )
      );
      setModalVisible(false);
    }
  };

  const openDeleteModal = (record: MealRecord) => {
    setSelectedRecord(record);
    setDeleteModalVisible(true);
  };

  const deleteRecord = () => {
    if (selectedRecord) {
      setMealRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== selectedRecord.id)
      );
      setDeleteModalVisible(false);
    }
  };

  const pickImage = async (record: MealRecord) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const updatedRecord = { ...record, imageUri: result.assets[0].uri };
      setMealRecords((prevRecords) =>
        prevRecords.map((r) => (r.id === record.id ? updatedRecord : r))
      );
    }
  };

  const renderMealRecord = ({ item }: { item: MealRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordInfo}>
        <View>
          <Text style={styles.recordTime}>
            {item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.mealType}>{item.mealType}</Text>
        </View>
        <Text style={styles.recordDuration}>{formatTime(item.duration)}</Text>
      </View>
      <View style={styles.recordActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => pickImage(item)}
        >
          <Ionicons name="camera-outline" size={24} color="#00CED1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openDeleteModal(item)}
        >
          <Ionicons name="trash-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.recordImage} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
        <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
          <FontAwesome5
            name={isRecording ? "stop" : "play"}
            size={30}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.recordsContainer}>
        <Text style={styles.recordsTitle}>今日の食事記録</Text>
        <FlatList
          data={mealRecords}
          renderItem={renderMealRecord}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>記録がありません</Text>}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>食事の種類を選択</Text>
          {(['朝食', '昼食', '間食', '夕食', '夜食'] as MealType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.modalButton}
              onPress={() => changeMealType(type)}
            >
              <Text style={styles.modalButtonText}>{type}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* 削除確認モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>記録を削除しますか？</Text>
          <Text style={styles.modalText}>この操作は取り消せません。</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={deleteRecord}
            >
              <Text style={styles.modalButtonTextDelete}>削除</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0FFFF',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 20,
  },
  timerButton: {
    backgroundColor: '#20B2AA',
    padding: 20,
    borderRadius: 50,
  },
  recordsContainer: {
    flex: 1,
    padding: 20,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 10,
  },
  recordItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B0E0E6',
    marginBottom: 10,
  },
  recordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  recordTime: {
    fontSize: 16,
    color: '#333',
  },
  recordDuration: {
    fontSize: 16,
    color: '#20B2AA',
    fontWeight: 'bold',
  },
  mealType: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  actionButton: {
    padding: 10,
    marginLeft: 15,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10,
  },
  uploadButton: {
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  recordImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  modalButtonTextDelete: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

});

export default RecordScreen;
