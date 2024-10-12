import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface PostFormProps {
  // route는 여기에 명시적으로 정의해 줍니다.
  route: {
    params: {
      post?: Post; // 수정 또는 새로운 게시글을 위한 post
    };
  };
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

// React.FC 대신 일반 함수형 컴포넌트로 변경
const PostForm = ({ route, navigation }: PostFormProps) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [post, setPost] = useState<Post | null>(null);
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('../../assets/fonts/Jua-Regular.ttf'),
  });

  useEffect(() => {
    if (route.params?.post) {
      const { post } = route.params;
      setPost(post);
      setTitle(post.title);
      setContent(post.content);
    }
  }, [route.params?.post]);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("제목과 내용을 입력해 주세요.");
      return;
    }

    const newPost: Post = {
      id: post ? post.id : Date.now().toString(),
      title,
      content,
      author: "익명",
    };

    try {
      const storedPosts = await AsyncStorage.getItem('posts');
      const postsArray: Post[] = storedPosts ? JSON.parse(storedPosts) : [];

      if (post) {
        // 기존 게시글 수정
        const updatedPosts = postsArray.map(item => (item.id === post.id ? newPost : item));
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      } else {
        // 새로운 게시글 추가
        postsArray.push(newPost);
        await AsyncStorage.setItem('posts', JSON.stringify(postsArray));
      }

      // PostList로 이동하면서 상태 업데이트
      navigation.navigate('PostList', { refresh: true });
    } catch (error) {
      console.error("게시글 저장 실패:", error);
    }
  };

  if (!fontsLoaded) {
    return null; // 폰트 로딩이 완료될 때까지 기다립니다.
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>게시글 작성</Text>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{post ? "수정 완료" : "게시글 작성"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFFF',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Jua-Regular',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Jua-Regular',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'Jua-Regular',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Jua-Regular',
  },
});

export default PostForm;
