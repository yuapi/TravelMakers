import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Title, Caption } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '@aws-amplify/auth';

interface MyData {
  nickname: string;
  email: string;
  gender: string;
  birthday: string;
  locale: string;
}

export default function MyPage() {
  const [user, setUser] = useState<MyData | null>(null);

  useEffect(() => {
    getMyData();
  }, []);

  const getMyData = async (): Promise<void> => {
    const resUser: string = await AsyncStorage.getItem('user') ?? "";
    const userdata = JSON.parse(resUser);

    const mydata: MyData = {
      nickname: userdata.nickname,
      email: userdata.email,
      gender: userdata.gender,
      birthday: userdata.birthday,
      locale: userdata.locale,
    };
    console.log(userdata);
    setUser(mydata);
  };

  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'),
  });

  const handleEmailPress = () => {
    Linking.openURL('mailto:travelmakers@googlegroups.com');
  };

  const handleAccountDeletion = () => {
    Alert.alert('계정 삭제', '정말로 이 계정을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        onPress: () => {
          console.log('계정 삭제 처리');
          Alert.alert('알림', '계정이 정상적으로 삭제되었습니다.', [
            { text: '확인', onPress: () => router.replace('/(main)') },
          ]);
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '로그아웃',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>마이 페이지</Title>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>닉네임: {user?.nickname ?? "불러오는 중.."}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>이메일: {user?.email ?? "불러오는 중.."}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>성별: {user?.gender === "Male" ? "남자" : user?.gender === "Female" ? "여자" : "비공개"}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>생년월일: {user?.birthday ?? ""}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="account-edit" size={20} color="#007aff" />
            <Text style={styles.sectionText}>개인정보 수정</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.separator} />
        <Link href="/notice" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="bell" size={20} color="#007aff" />
            <Text style={styles.sectionText}>공지사항</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.separator} />
        <Link href="/terms" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color="#007aff" />
            <Text style={styles.sectionText}>약관 및 정책</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.infoContainer}>
        <Caption style={styles.infoText}>현재 버전: 1.0.0</Caption>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleAccountDeletion}>
        <Text style={styles.deleteButtonText}>회원탈퇴</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FFFF',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007aff',
    fontFamily: 'Jua-Regular',
  },
  nicknameContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Jua-Regular',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    fontFamily: 'Jua-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'Jua-Regular',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Jua-Regular',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Jua-Regular',
  },
});
