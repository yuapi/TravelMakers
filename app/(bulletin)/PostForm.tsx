import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface PostFormProps {
  route: {
    params: {
      post?: Post;
    };
  };
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

const PostForm: React.FC<PostFormProps> = ({ route, navigation }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [post, setPost] = useState<Post | null>(null);

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

  return (
    <View style={styles.container}>
      <Text></Text>
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
      <Button title={post ? "수정 완료" : "게시글 작성"} onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default PostForm;
