import { getCurrentUser, fetchAuthSession } from '@aws-amplify/auth';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api } from '@/config.json';

interface UserData {
  uid: string
  username: string
  nickname: string
  email: string
  gender: string
  birthday: string
  locale: string
  regdate: string
  tokens: {
    accessToken: string
    idToken: string
  }
}

async function getUser(): Promise<void> {
  try {
    const { userId, username } = await getCurrentUser();
    const { tokens } = await fetchAuthSession({ forceRefresh: true });
    const accessToken = tokens?.accessToken.toString() ?? "";
    const idToken = tokens?.idToken?.toString() ?? "";

    const response = await axios.get(`/v1/user/${username.split("_")[1]}`, {
      baseURL: api.baseURL,
      headers: { Authorization: idToken },
    })
    const data = JSON.parse(response.data.body);

    const resUser: UserData = {
      uid: userId,
      username: username,
      nickname: data.nickname,
      email: data.email,
      gender: data.gender ?? '',
      birthday: data.birthday ?? '',
      locale: data.locale ?? '',
      regdate: data.regdate,
      tokens: {
        accessToken: accessToken,
        idToken: idToken
      }
    }
    await AsyncStorage.setItem("user", JSON.stringify(resUser));

  } catch (error) {
    console.error(error);
    console.log("Not signed in");
  }
}

exports.getUser = getUser

const MainScreen = () => {
  useEffect(() => {
		getUser();
	}, []);

  return (
    <View style={styles.container}>
      <Link href='/' style={styles.button}>
        <Text style={styles.buttonText}>로그인</Text>
      </Link>
      <Link href='/mypage' style={styles.button}>
        <Text style={styles.buttonText}>마이페이지</Text>
      </Link>
      <Link href='/question1' style={styles.button}>
        <Text style={styles.buttonText}>Question1 테스트</Text>
      </Link>
      <Link href='/postlist' style={styles.button}>
        <Text style={styles.buttonText}>게시판</Text>
      </Link>
      <Link href='/chatbot' style={styles.button}>
        <Text style={styles.buttonText}>챗봇</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default MainScreen;
