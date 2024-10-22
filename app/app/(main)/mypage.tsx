import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, SafeAreaView } from 'react-native';
import { Caption } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { fetchAuthSession, signOut, deleteUser } from '@aws-amplify/auth';
import axios from 'axios';
import { api } from '@/config.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MyData {
  nickname: string
  email: string
  gender: string
  birthday: string
  locale: string
}

export default function MyPage() {
	const [user, setUser] = useState<MyData | null>(null);

  useEffect(() => {
    getMyData()
	}, []);

  const getMyData = async (): Promise<void> => {
    try {
      const { tokens } = await fetchAuthSession();
      const response = await axios.get('/v1/user', {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() }
      })
      const data = JSON.parse(response.data.body);
      setUser(data);
    } catch (error) {
      console.error('Error from fetching MyData:', error);
    }
  }

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
        onPress: async () => {
          try {
            const { tokens } = await fetchAuthSession();
            const response = await axios.delete('/v1/user', {
              baseURL: api.baseURL,
              headers: { Authorization: tokens?.idToken?.toString() }
            })
            console.log(response.data)
            if (response.data.statusCode != 200) throw (response.data.statusCode);

            await deleteUser();

            Alert.alert('알림', '계정이 정상적으로 삭제되었습니다.');
            router.replace('/');
          } catch (error) {
            console.error('Error from deleting User:', error);
          }
        }
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
          router.replace('/')
        }
      },
    ]);
  };

  if (!fontsLoaded) {
    return null;
  }

  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollViewContent, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>마이 페이지</Text>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>닉네임: {user?.nickname ?? "불러오는 중.."}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>이메일: {user?.email ?? "불러오는 중.."}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>성별: {user?.gender == "Male" ? "남자" : user?.gender == "Female" ? "여자" : "비공개"}</Text>
        </View>
        <View style={styles.nicknameContainer}>
          <Text style={styles.nickname}>생년월일: {user?.birthday ?? "비공개"}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="account-edit" size={20} color="#007aff" />
            <Text style={styles.sectionText}>개인정보 수정                                    </Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.separator} />
        <Link href="/notice" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="bell" size={20} color="#007aff" />
            <Text style={styles.sectionText}>공지사항                                         </Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.separator} />
        <Link href="/terms" asChild>
          <TouchableOpacity style={styles.section}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color="#007aff" />
            <Text style={styles.sectionText}>약관 및 정책                                      </Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007aff',
    fontFamily: 'Jua-Regular',
    marginBottom: 10,
  },
  nicknameContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Jua-Regular',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  section: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  sectionText: {
    fontSize: 18, 
    color: '#000',
    marginLeft: 10,
    fontFamily: 'Jua-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'Jua-Regular',
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Jua-Regular',
  },
  logoutButton: {
    padding: 12,
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
