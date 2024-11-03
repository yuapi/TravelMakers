import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { api } from '@/config.json';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

const PostForm = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fontsLoaded] = useFonts({
    'Montserrat': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
    'NanumGothic': require('../../assets/fonts/NanumGothic.otf'),
    'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'),
  });

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.pid) {
      getPostDetail(Number(params.pid));
    }
  }, []);

  async function getPostDetail(pid: number) {
    try {
      const currentUser = await getCurrentUser();
      const { tokens } = await fetchAuthSession();
      const response = await axios.get(`/v1/post/${pid}`, {
        baseURL: api.baseURL,
        headers: { Authorization: tokens?.idToken?.toString() }
      });
      const data = JSON.parse(response.data.body);

      if (data.userid !== currentUser.userId) {
        Alert.alert("잘못된 접근입니다.");
        router.back();
        return;
      }

      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    }
  }

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("제목과 내용을 입력해 주세요.");
      return;
    }

    try {
      const { tokens } = await fetchAuthSession();
      let response;

      if (params?.pid) {
        response = await axios.put(`/v1/post/${params.pid}`, {
          title: title,
          content: content,
        }, {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() }
        });
      } else {
        response = await axios.post('/v1/post', {
          title: title,
          content: content,
        }, {
          baseURL: api.baseURL,
          headers: { Authorization: tokens?.idToken?.toString() }
        });
      }
      router.back();
    } catch (error) {
      console.error("게시글 저장 실패:", error);
    }
  };

  if (!fontsLoaded) {
    return null; // 폰트 로딩이 완료될 때까지 기다립니다.
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>게시글 작성</Text>
        <View style={styles.bar} />
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>내용</Text>
        <TextInput
          style={styles.inputContent}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{params?.pid ? "수정 완료" : "게시글 작성"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFF',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-VariableFont_wght', 
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  bar: {
    height: 2.5, 
    width: '200%', 
    backgroundColor: '#007AFF', 
    marginBottom: 20, 
    right: '50%', 
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'NanumGothic', 
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    fontFamily: 'NanumGothic', 
  },
  inputContent: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    fontFamily: 'NanumGothic', 
  },
  saveButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NanumGothic',
  },
});

export default PostForm;
