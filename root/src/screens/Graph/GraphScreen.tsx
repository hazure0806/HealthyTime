import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface WeeklyData {
  date: string;
  totalTime: number;
}

interface DailyData {
  meal: string;
  time: number;
}

const GraphScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2024-09-02');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const weeklyData: WeeklyData[] = [
    { date: '5/1', totalTime: 65 },
    { date: '5/2', totalTime: 70 },
    { date: '5/3', totalTime: 60 },
    { date: '5/4', totalTime: 80 },
    { date: '5/5', totalTime: 75 },
    { date: '5/6', totalTime: 85 },
    { date: '5/7', totalTime: 72 },
  ];

  const dailyData: DailyData[] = [
    { meal: '朝食', time: 35 },
    { meal: '昼食', time: 30 },
  ];

  const toggleModalVisibility = (): void => {
    setModalVisible(!isModalVisible);
  };

  const handleDayPress = (day: DateData): void => {
    setSelectedDate(day.dateString);
    setModalVisible(false);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 206, 209, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>過去7日間の総食事時間</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: weeklyData.map(data => data.date),
                datasets: [{ data: weeklyData.map(data => data.totalTime) }]
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          <Text style={styles.title}>日別の食事時間</Text>
          <TouchableOpacity onPress={toggleModalVisibility} style={styles.dateSelector}>
            <Icon name="chevron-left" size={24} color="#00CED1" />
            <Text style={styles.selectedDate}>{selectedDate}</Text>
            <Icon name="chevron-right" size={24} color="#00CED1" />
          </TouchableOpacity>

          <Modal isVisible={isModalVisible} onBackdropPress={toggleModalVisibility}>
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: '#00CED1' },
                }}
                theme={{
                  selectedDayBackgroundColor: '#00CED1',
                  todayTextColor: '#00CED1',
                  arrowColor: '#00CED1',
                }}
              />
            </View>
          </Modal>

          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: dailyData.map(data => data.meal),
                datasets: [{ data: dailyData.map(data => data.time) }]
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix="分"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 10,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDate: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default GraphScreen;
