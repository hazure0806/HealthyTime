// AppNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RecordScreen from '../screens/Record/RecordScreen';
import GraphScreen from '../screens/Graph/GraphScreen';
import UserScreen from '../screens/User/UserScreen';
import HistoryScreen from '../screens/History/HistoryScreen';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const CustomHeader: React.FC<{ title: string }> = ({ title }) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#40E0D0', '#20B2AA']}
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </LinearGradient>
  );
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: ({ options }) => <CustomHeader title={options.title || ''} />,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Record':
              iconName = 'pencil-alt';
              break;
            case 'Graph':
              iconName = 'chart-line';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'User':
              iconName = 'user';
              break;
            default:
              iconName = 'question-circle';
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: '#B0C4DE',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Record" component={RecordScreen} options={{ title: '記録' }} />
      <Tab.Screen name="Graph" component={GraphScreen} options={{ title: 'グラフ' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: '履歴' }} />
      <Tab.Screen name="User" component={UserScreen} options={{ title: 'ユーザー' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default AppNavigator;