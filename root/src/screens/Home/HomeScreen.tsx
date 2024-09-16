import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Graph: undefined;
  History: undefined;
  User: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todaysTotalTime, setTodaysTotalTime] = useState(0);
  const [mealsCount, setMealsCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRecording && elapsedTime !== 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, elapsedTime]);

  const handleStartStop = () => {
    if (isRecording) {
      // 記録を停止し、合計時間を更新
      setTodaysTotalTime((prevTotal) => prevTotal + elapsedTime);
      setMealsCount((prevCount) => prevCount + 1);
      setElapsedTime(0);
    }
    setIsRecording(!isRecording);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={['#E0FFFF', '#B0E0E6', '#87CEEB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>食事を記録</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          <TouchableOpacity style={styles.timerButton} onPress={handleStartStop}>
            <MaterialIcons 
              name={isRecording ? "stop" : "play-arrow"} 
              size={40} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>今日の食事回数</Text>
            <Text style={styles.statValue}>{mealsCount}回</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>今日の合計時間</Text>
            <Text style={styles.statValue}>{formatTime(todaysTotalTime)}</Text>
          </View>
        </View>

        <View style={styles.quickLinksContainer}>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Graph')}>
            <MaterialIcons name="bar-chart" size={24} color="#20B2AA" />
            <Text style={styles.quickLinkText}>統計</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('History')}>
            <MaterialIcons name="history" size={24} color="#20B2AA" />
            <Text style={styles.quickLinkText}>履歴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('User')}>
            <MaterialIcons name="person" size={24} color="#20B2AA" />
            <Text style={styles.quickLinkText}>プロフィール</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 10,
  },
  timerButton: {
    backgroundColor: '#20B2AA',
    borderRadius: 50,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#4682B4',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickLink: {
    alignItems: 'center',
  },
  quickLinkText: {
    marginTop: 5,
    color: '#20B2AA',
  },
});


export default HomeScreen;