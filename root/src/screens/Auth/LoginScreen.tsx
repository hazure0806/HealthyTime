import React, { useState } from 'react';
import { Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Box, Input, Button, Text, VStack, Center, Heading, useToast, KeyboardAvoidingView, Icon } from 'native-base';
import { Auth } from 'aws-amplify';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// スタックナビゲーションのルートパラメータを定義
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSignIn = async () => {
    try {
      // await Auth.signIn(username, password);
      navigation.replace('Main'); // 'HomeScreen' へ遷移
    } catch (err: any) {
      setError(err.message);
      toast.show({
        title: "ログインエラー",
        description: err.message,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={['#20B2AA', '#48D1CC', '#00CED1']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Center flex={1} px={4}>
              <VStack space={5} alignItems="center" w="100%" maxW="300px">
                <Heading size="2xl" color="white" fontWeight="bold">
                  HealthyTime
                </Heading>
                <Input
                  placeholder="ユーザー名"
                  value={username}
                  onChangeText={setUsername}
                  bg="rgba(255, 255, 255, 0.2)"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  fontSize="md"
                  h={12}
                  _focus={{ bg: "rgba(255, 255, 255, 0.3)" }}
                />
                <Input
                  placeholder="パスワード"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  bg="rgba(255, 255, 255, 0.2)"
                  borderWidth={0}
                  color="white"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  fontSize="md"
                  h={12}
                  _focus={{ bg: "rgba(255, 255, 255, 0.3)" }}
                />
                <Button
                  onPress={handleSignIn}
                  w="100%"
                  bg="white"
                  _text={{ color: "#20B2AA", fontWeight: "bold" }}
                  h={12}
                  _pressed={{ bg: "gray.100" }}
                >
                  ログイン
                </Button>
                {error !== '' && (
                  <Text color="red.100" textAlign="center">
                    {error}
                  </Text>
                )}
                <Text color="white" fontSize="sm">
                  ログイン情報をお忘れですか？ログインのヘルプをご覧ください。
                </Text>
                <Button
                  w="100%"
                  variant="outline"
                  borderColor="white"
                  _text={{ color: "white" }}
                  leftIcon={<Icon as={MaterialIcons} name="facebook" size="sm" color="white" />}
                >
                  Facebookでログイン
                </Button>
              </VStack>
              <Box position="absolute" bottom={10}>
                <Text color="white" fontSize="sm">
                  アカウントをお持ちでない場合は <Text fontWeight="bold" onPress={() => console.log('Sign up')}>新規登録</Text>
                </Text>
              </Box>
            </Center>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
