import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
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



function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              return <MaterialIcons name="home" size={size} color={color} />;
            case 'Record':
              return <FontAwesome name="pencil" size={size} color={color} />; // 適切なアイコンを選択
            case 'Graph':
              return <FontAwesome name="line-chart" size={size} color={color} />; // 適切なアイコンを選択
            case 'History':
              return <MaterialIcons name="history" size={size} color={color} />;
            case 'User':
              return <FontAwesome name="user" size={size} color={color} />;
            default:
              return <MaterialIcons name="error" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'ホーム' }} />
      <Tab.Screen name="Record" component={RecordScreen} options={{ title: '記録' }} />
      <Tab.Screen name="Graph" component={GraphScreen} options={{ title: 'グラフ' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: '履歴' }} />
      <Tab.Screen name="User" component={UserScreen} options={{ title: 'ユーザー' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
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
